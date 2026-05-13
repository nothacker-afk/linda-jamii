/**
 * LindaJamii C Service — main.c
 *
 * A lightweight TCP HTTP micro-service written in pure C.
 * Exposes:
 *   GET /health        → JSON health-check
 *   GET /info          → Service metadata
 *   GET /hash?text=... → DJB2 hash of the provided text
 *   GET /stats         → Uptime + request counter
 *
 * Build:  gcc -o lindajamii-service src/main.c -I include -Wall -O2
 * Run:    ./lindajamii-service
 */

#include "lindajamii.h"
#include <signal.h>
#include <errno.h>

/* ── Global state ─────────────────────────────────────────────────── */
static time_t  start_time;
static uint64_t request_count = 0;
static volatile int running   = 1;

/* ── Signal handler ───────────────────────────────────────────────── */
static void handle_signal(int sig) {
    (void)sig;
    running = 0;
}

/* ── Utility: DJB2 hash ───────────────────────────────────────────── */
uint32_t djb2_hash(const char *str) {
    uint32_t hash = 5381;
    int c;
    while ((c = (unsigned char)*str++))
        hash = ((hash << 5) + hash) + c;
    return hash;
}

/* ── Utility: URL decode ──────────────────────────────────────────── */
void url_decode(char *dst, const char *src, size_t max) {
    size_t i = 0;
    while (*src && i < max - 1) {
        if (*src == '%' && src[1] && src[2]) {
            char hex[3] = { src[1], src[2], '\0' };
            dst[i++] = (char)strtol(hex, NULL, 16);
            src += 3;
        } else if (*src == '+') {
            dst[i++] = ' ';
            src++;
        } else {
            dst[i++] = *src++;
        }
    }
    dst[i] = '\0';
}

/* ── Utility: extract query param ────────────────────────────────── */
char *extract_query_param(const char *query, const char *key) {
    if (!query || !key) return NULL;
    size_t klen = strlen(key);
    const char *p = query;
    while (*p) {
        if (strncmp(p, key, klen) == 0 && p[klen] == '=') {
            char *val = malloc(strlen(p + klen + 1) + 1);
            if (!val) return NULL;
            url_decode(val, p + klen + 1, strlen(p + klen + 1) + 1);
            /* trim at next '&' */
            char *amp = strchr(val, '&');
            if (amp) *amp = '\0';
            return val;
        }
        p = strchr(p, '&');
        if (!p) break;
        p++;
    }
    return NULL;
}

/* ── HTTP response helpers ────────────────────────────────────────── */
void send_response(int fd, int status, const char *ct, const char *body) {
    char header[512];
    const char *status_text = (status == 200) ? "OK" :
                              (status == 404) ? "Not Found" :
                              (status == 400) ? "Bad Request" : "Internal Server Error";
    int body_len = body ? (int)strlen(body) : 0;
    snprintf(header, sizeof(header),
             "HTTP/1.1 %d %s\r\n"
             "Content-Type: %s\r\n"
             "Content-Length: %d\r\n"
             "Access-Control-Allow-Origin: *\r\n"
             "Connection: close\r\n"
             "\r\n",
             status, status_text, ct, body_len);
    write(fd, header, strlen(header));
    if (body) write(fd, body, body_len);
}

void send_json(int fd, const char *json) {
    send_response(fd, 200, "application/json", json);
}

void send_404(int fd) {
    send_response(fd, 404, "application/json",
                  "{\"error\":\"Not Found\",\"service\":\"LindaJamii C Service\"}");
}

/* ── Route: GET /health ───────────────────────────────────────────── */
void handle_health(int fd) {
    char buf[256];
    snprintf(buf, sizeof(buf),
             "{\"status\":\"ok\","
             "\"service\":\"%s\","
             "\"version\":\"%s\","
             "\"language\":\"C\"}",
             APP_NAME, VERSION);
    send_json(fd, buf);
}

/* ── Route: GET /info ─────────────────────────────────────────────── */
void handle_info(int fd) {
    char buf[512];
    snprintf(buf, sizeof(buf),
             "{"
             "\"name\":\"LindaJamii\","
             "\"description\":\"Community safety & neighbourhood watch platform\","
             "\"c_service\":{\"port\":%d,\"version\":\"%s\"},"
             "\"stack\":[\"C\",\"Python\",\"Java\",\"HTML/CSS/JS\"]"
             "}",
             SERVER_PORT, VERSION);
    send_json(fd, buf);
}

/* ── Route: GET /hash?text=... ────────────────────────────────────── */
void handle_hash(int fd, const char *query) {
    char *text = extract_query_param(query, "text");
    if (!text) {
        send_response(fd, 400, "application/json",
                      "{\"error\":\"Missing 'text' query parameter\"}");
        return;
    }
    uint32_t h = djb2_hash(text);
    char buf[256];
    snprintf(buf, sizeof(buf),
             "{\"input\":\"%s\",\"djb2_hash\":%u,\"hex\":\"0x%08X\"}",
             text, h, h);
    free(text);
    send_json(fd, buf);
}

/* ── Route: GET /stats ────────────────────────────────────────────── */
void handle_stats(int fd) {
    time_t now    = time(NULL);
    long   uptime = (long)(now - start_time);
    char buf[256];
    snprintf(buf, sizeof(buf),
             "{\"uptime_seconds\":%ld,\"requests_served\":%llu}",
             uptime, (unsigned long long)request_count);
    send_json(fd, buf);
}

/* ── Request dispatcher ───────────────────────────────────────────── */
void dispatch(int fd, const char *method, const char *path, const char *query) {
    (void)method; /* only GET supported */
    if (strcmp(path, "/health") == 0)      handle_health(fd);
    else if (strcmp(path, "/info") == 0)   handle_info(fd);
    else if (strcmp(path, "/hash") == 0)   handle_hash(fd, query);
    else if (strcmp(path, "/stats") == 0)  handle_stats(fd);
    else                                    send_404(fd);
}

/* ── Parse raw HTTP request ───────────────────────────────────────── */
static void parse_and_dispatch(int fd, const char *raw) {
    char method[16] = {0}, path[256] = {0}, query[512] = {0};
    /* Extract method */
    const char *p = raw;
    size_t i = 0;
    while (*p && *p != ' ' && i < sizeof(method) - 1) method[i++] = *p++;
    if (*p == ' ') p++;
    /* Extract path + query */
    i = 0;
    char full_path[768] = {0};
    while (*p && *p != ' ' && i < sizeof(full_path) - 1) full_path[i++] = *p++;
    char *q = strchr(full_path, '?');
    if (q) {
        strncpy(query, q + 1, sizeof(query) - 1);
        *q = '\0';
    }
    strncpy(path, full_path, sizeof(path) - 1);
    dispatch(fd, method, path, query[0] ? query : NULL);
}

/* ── Main server loop ─────────────────────────────────────────────── */
int main(void) {
    signal(SIGINT,  handle_signal);
    signal(SIGTERM, handle_signal);

    start_time = time(NULL);

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) { perror("socket"); return 1; }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr = {
        .sin_family      = AF_INET,
        .sin_addr.s_addr = INADDR_ANY,
        .sin_port        = htons(SERVER_PORT)
    };

    if (bind(server_fd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind"); close(server_fd); return 1;
    }
    if (listen(server_fd, BACKLOG) < 0) {
        perror("listen"); close(server_fd); return 1;
    }

    printf("[%s] Listening on port %d\n", APP_NAME, SERVER_PORT);

    while (running) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr *)&client_addr, &client_len);
        if (client_fd < 0) {
            if (errno == EINTR) break;
            perror("accept");
            continue;
        }
        request_count++;

        char buf[BUFFER_SIZE] = {0};
        ssize_t n = read(client_fd, buf, sizeof(buf) - 1);
        if (n > 0) {
            buf[n] = '\0';
            parse_and_dispatch(client_fd, buf);
        }
        close(client_fd);
    }

    close(server_fd);
    printf("[%s] Shutting down. Total requests: %llu\n",
           APP_NAME, (unsigned long long)request_count);
    return 0;
}
