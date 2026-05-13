"""
In-memory data store for LindaJamii Python API.
In production this would be replaced by a real database (PostgreSQL / MySQL).
"""

from datetime import datetime, timezone
from typing import List, Dict, Any
import uuid

# ── Incidents ────────────────────────────────────────────────────────
_incidents: List[Dict[str, Any]] = [
    {
        "id": "inc-001",
        "title": "Suspicious activity near Westlands",
        "description": "Unknown vehicle parked for 3+ hours, occupants watching the area.",
        "category": "suspicious",
        "severity": "medium",
        "location": {"lat": -1.2676, "lng": 36.8119, "address": "Westlands, Nairobi"},
        "reporter": "anonymous",
        "status": "open",
        "created_at": "2025-05-10T08:30:00Z",
        "upvotes": 12,
    },
    {
        "id": "inc-002",
        "title": "Street light out on Ngong Road",
        "description": "Three consecutive street lights are non-functional, creating a dark spot.",
        "category": "infrastructure",
        "severity": "low",
        "location": {"lat": -1.3001, "lng": 36.7820, "address": "Ngong Road, Nairobi"},
        "reporter": "john_doe",
        "status": "in_progress",
        "created_at": "2025-05-11T19:45:00Z",
        "upvotes": 5,
    },
    {
        "id": "inc-003",
        "title": "Armed robbery at Kilimani ATM",
        "description": "Two suspects on a motorbike robbed a pedestrian at knifepoint.",
        "category": "crime",
        "severity": "high",
        "location": {"lat": -1.2890, "lng": 36.7870, "address": "Kilimani, Nairobi"},
        "reporter": "jane_smith",
        "status": "resolved",
        "created_at": "2025-05-12T22:10:00Z",
        "upvotes": 34,
    },
]

# ── Community members ────────────────────────────────────────────────
_members: List[Dict[str, Any]] = [
    {"id": "usr-001", "name": "Alice Wanjiku",  "neighbourhood": "Westlands",  "role": "warden",  "joined": "2024-01-15"},
    {"id": "usr-002", "name": "Brian Otieno",   "neighbourhood": "Kilimani",   "role": "member",  "joined": "2024-03-22"},
    {"id": "usr-003", "name": "Carol Muthoni",  "neighbourhood": "Parklands",  "role": "admin",   "joined": "2023-11-01"},
    {"id": "usr-004", "name": "David Kamau",    "neighbourhood": "Ngong Road", "role": "member",  "joined": "2025-01-08"},
]

# ── Alerts ───────────────────────────────────────────────────────────
_alerts: List[Dict[str, Any]] = [
    {
        "id": "alt-001",
        "message": "High crime advisory: avoid Eastleigh after 10 PM",
        "level": "warning",
        "area": "Eastleigh",
        "issued_at": "2025-05-13T06:00:00Z",
        "expires_at": "2025-05-14T06:00:00Z",
        "active": True,
    },
    {
        "id": "alt-002",
        "message": "Neighbourhood watch patrol tonight at 8 PM — Westlands",
        "level": "info",
        "area": "Westlands",
        "issued_at": "2025-05-13T10:00:00Z",
        "expires_at": "2025-05-13T23:59:00Z",
        "active": True,
    },
]


# ── Accessor helpers ─────────────────────────────────────────────────
def get_incidents() -> List[Dict[str, Any]]:
    return list(_incidents)

def get_incident(incident_id: str) -> Dict[str, Any] | None:
    return next((i for i in _incidents if i["id"] == incident_id), None)

def add_incident(data: Dict[str, Any]) -> Dict[str, Any]:
    incident = {
        "id": f"inc-{uuid.uuid4().hex[:6]}",
        "title":       data.get("title", "Untitled"),
        "description": data.get("description", ""),
        "category":    data.get("category", "other"),
        "severity":    data.get("severity", "low"),
        "location":    data.get("location", {}),
        "reporter":    data.get("reporter", "anonymous"),
        "status":      "open",
        "created_at":  datetime.now(timezone.utc).isoformat(),
        "upvotes":     0,
    }
    _incidents.append(incident)
    return incident

def get_members() -> List[Dict[str, Any]]:
    return list(_members)

def get_alerts() -> List[Dict[str, Any]]:
    return [a for a in _alerts if a["active"]]

def add_alert(data: Dict[str, Any]) -> Dict[str, Any]:
    alert = {
        "id":         f"alt-{uuid.uuid4().hex[:6]}",
        "message":    data.get("message", ""),
        "level":      data.get("level", "info"),
        "area":       data.get("area", "General"),
        "issued_at":  datetime.now(timezone.utc).isoformat(),
        "expires_at": data.get("expires_at", ""),
        "active":     True,
    }
    _alerts.append(alert)
    return alert
