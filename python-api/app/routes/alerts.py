"""Safety alerts routes."""

from flask import Blueprint, jsonify, request, abort
from ..models.store import get_alerts, add_alert

alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.get("/")
def list_alerts():
    """Return all active safety alerts."""
    alerts = get_alerts()
    area = request.args.get("area")
    if area:
        alerts = [a for a in alerts if a["area"].lower() == area.lower()]
    return jsonify({"total": len(alerts), "alerts": alerts})


@alerts_bp.post("/")
def create_alert():
    """Issue a new safety alert."""
    data = request.get_json(silent=True)
    if not data or not data.get("message"):
        abort(400, description="Request body must include a 'message' field.")
    alert = add_alert(data)
    return jsonify(alert), 201


@alerts_bp.errorhandler(400)
def bad_request(e):
    return jsonify({"error": str(e)}), 400
