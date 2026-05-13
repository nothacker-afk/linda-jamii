# LindaJamii — Python REST API

A Flask-based REST API providing the core business logic for the LindaJamii community safety platform.  
Runs on **port 5000**.

## Setup & Run

```bash
pip install -r requirements.txt
python run.py
# or production:
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + uptime |
| GET | `/api/` | API root / index |
| GET | `/api/incidents/` | List all incidents (filterable) |
| GET | `/api/incidents/<id>` | Get single incident |
| POST | `/api/incidents/` | Report new incident |
| GET | `/api/community/members` | List community members |
| GET | `/api/community/stats` | Aggregated stats |
| GET | `/api/alerts/` | List active alerts |
| POST | `/api/alerts/` | Issue new alert |

## Query Filters (Incidents)

```
GET /api/incidents/?category=crime
GET /api/incidents/?severity=high
GET /api/incidents/?status=open
```

## Example — Report an Incident

```bash
curl -X POST http://localhost:5000/api/incidents/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken fence on Mombasa Road",
    "description": "Fence broken, allowing unauthorized access.",
    "category": "infrastructure",
    "severity": "medium",
    "location": {"address": "Mombasa Road, Nairobi"},
    "reporter": "alice_w"
  }'
```
