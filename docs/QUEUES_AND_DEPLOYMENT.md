# 🚀 Queues, Async, and Deployment Guide

This guide covers the advanced architecture for handling asynchronous tasks and production deployment, inspired by modern engineering standards.

---

## 🔄 Chapter 7: Queues & Async Processing

### 1. The Queue Explainer (Decoupling)
In LindaJamii, we decouple the **Request** from the **Processing**. When a user reports an incident:
1. **Frontend** sends POST to Python API.
2. **API** validates the request and enqueues it to a **Message Broker**.
3. **API** returns `202 Accepted` immediately.
4. **Background Worker** picks up the message and processes it (AI analysis, alert broadcasting).

### 2. Message Lifecycle
- **Visibility Timeout**: Ensures a message isn't picked up by another worker while being processed.
- **Acknowledgements (ACKs)**: Worker signals completion; if it fails, the message returns to the queue.
- **Retries & Dead Letter Queues (DLQ)**: Failed messages are retried 3 times before being moved to a DLQ for manual inspection.

### 3. Incident Alert Pipeline (Video-Upload Style)
| Step | Action | Service |
|------|--------|---------|
| 1 | Ingest Incident Data | Python API |
| 2 | Enqueue to 'incident-raw' | RabbitMQ / SQS |
| 3 | Extract Location & Severity | Worker A (Python) |
| 4 | Match with Neighbourhood Watch | Worker B (Java) |
| 5 | Broadcast Push Notifications | Worker C (Node.js) |
| 6 | Finalize & Archive | PostgreSQL |

### 4. Broker Comparison Table
| Feature | SQS (AWS) | RabbitMQ | Kafka |
|---------|-----------|----------|-------|
| **Type** | Managed Service | Traditional Broker | Event Streaming |
| **Complexity** | Low | Medium | High |
| **Throughput** | High | Medium | Extreme |
| **Ordering** | FIFO optional | Guaranteed | Guaranteed |
| **Use Case** | Cloud Native | Complex Routing | Real-time Logs/Big Data |

---

## 🛠️ Chapter 8: Deployment & Robustness

### 1. Environment Configuration
Always use `.env` files and never commit secrets.
```bash
# Example .env
FLASK_ENV=production
DB_URL=postgresql://user:pass@localhost:5432/lindajamii
JWT_SECRET=super-secret-key
C_SERVICE_URL=http://localhost:8090

# M-Pesa Daraja API
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb2...

# External Info APIs
OPENWEATHER_API_KEY=your_weather_key
NEWS_API_KEY=your_news_key
```

### 2. Local Startup Commands
```bash
# Production-ready startup
gunicorn --workers 4 --bind 0.0.0.0:5050 app:app          # Python
java -Dspring.profiles.active=prod -jar api.jar           # Java
./lindajamii-service &                                    # C
```

### 3. Cascading Health Checks
LindaJamii implements a "Deep Health Check" where the Python API's `/health` endpoint also pings the C Service and Database. If any dependency is down, the status is `DEGRADED`.

### 4. Security (JWT + Bcrypt)
- **Passwords**: Hashed using `bcrypt` with a salt round of 12.
- **Authentication**: Stateless JWT tokens passed in the `Authorization: Bearer <token>` header.
- **Security Annotations**: Java controllers use `@PreAuthorize` for Role-Based Access Control (RBAC).

### 5. Error Envelope Convention
All APIs return a consistent JSON envelope:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid token",
    "details": "Token expired at 1625000000"
  }
}
```

### 6. CI/CD Pipeline (GitHub Actions)
1. **Lint & Test**: Run `pytest` and `mvn test`.
2. **Build**: Build Docker images for each service.
3. **Scan**: Run `Snyk` or `Trivy` for security vulnerabilities.
4. **Deploy**: Push to ECR and update ECS/K8s cluster.

### 7. Pre-Launch Security Checklist
- [ ] Disable Debug mode in Flask/Spring.
- [ ] Enable CORS with specific origins (no `*`).
- [ ] Set `HttpOnly` and `Secure` flags on cookies.
- [ ] Implement Rate Limiting (Nginx or Flask-Limiter).
- [ ] Rotate all API keys and secrets.
- [ ] Verify SQL injection protection (ORM usage).
