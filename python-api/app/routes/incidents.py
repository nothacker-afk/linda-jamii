"""Incidents CRUD routes."""

from flask import Blueprint, jsonify, request, abort
from ..models.store import get_incidents, get_incident, add_incident

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.get("/")
def list_incidents():
    """Return all incidents, optionally filtered by category or severity."""
    incidents = get_incidents()
    category = request.args.get("category")
    severity = request.args.get("severity")
    status   = request.args.get("status")

    if category:
        incidents = [i for i in incidents if i["category"] == category]
    if severity:
        incidents = [i for i in incidents if i["severity"] == severity]
    if status:
        incidents = [i for i in incidents if i["status"] == status]

    return jsonify({
        "total": len(incidents),
        "incidents": incidents,
    })


@incidents_bp.get("/<incident_id>")
def get_one(incident_id: str):
    """Return a single incident by ID."""
    incident = get_incident(incident_id)
    if not incident:
        abort(404, description=f"Incident '{incident_id}' not found.")
    return jsonify(incident)


@incidents_bp.post("/")
def create_incident():
    """Create a new incident report."""
    data = request.get_json(silent=True)
    if not data or not data.get("title"):
        abort(400, description="Request body must include at least a 'title' field.")
    incident = add_incident(data)
    return jsonify(incident), 201


@incidents_bp.errorhandler(404)
def not_found(e):
    return jsonify({"error": str(e)}), 404


@incidents_bp.errorhandler(400)
def bad_request(e):
    return jsonify({"error": str(e)}), 400
