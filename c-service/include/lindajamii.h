/**
 * LindaJamii C Service
 * Provides low-level HTTP utilities, hashing, and health-check endpoints.
 * Compiled to a standalone TCP micro-service on port 8090.
 */

#ifndef LINDAJAMII_H
#define LINDAJAMII_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <time.h>
#include <stdint.h>

#define SERVER_PORT   8090
#define BACKLOG       10
#define BUFFER_SIZE   4096
#define VERSION       "1.0.0"
#define APP_NAME      "LindaJamii C Service"

/* ── HTTP helpers ─────────────────────────────────────────────────── */
void send_response(int client_fd, int status, const char *content_type,
                   const char *body);
void send_json(int client_fd, const char *json);
void send_404(int client_fd);

/* ── Route handlers ───────────────────────────────────────────────── */
void handle_health(int client_fd);
void handle_info(int client_fd);
void handle_hash(int client_fd, const char *query);
void handle_stats(int client_fd);
void dispatch(int client_fd, const char *method,
              const char *path, const char *query);

/* ── Utility functions ────────────────────────────────────────────── */
uint32_t djb2_hash(const char *str);
void url_decode(char *dst, const char *src, size_t max);
char *extract_query_param(const char *query, const char *key);

#endif /* LINDAJAMII_H */
