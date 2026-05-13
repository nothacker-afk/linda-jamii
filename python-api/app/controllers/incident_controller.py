from flask import Blueprint, request, jsonify
from app.services.incident_service import IncidentService

incident_bp = Blueprint('incidents', __name__)
incident_service = IncidentService()

@incident_bp.route('/', methods=['POST'])
def report_incident():
    """
    Report a new incident.
    Returns 202 Accepted and enqueues the processing task.
    """
    data = request.get_json()
    
    # Basic validation (delegated to validator in real app)
    if not data or 'title' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Enqueue work via service
    job_id = incident_service.enqueue_incident_processing(data)

    return jsonify({
        "status": "Accepted",
        "message": "Incident report received and enqueued for processing.",
        "job_id": job_id,
        "retry_after": 30
    }), 202

@incident_bp.route('/', methods=['GET'])
def list_incidents():
    return jsonify(incident_service.get_all_incidents()), 200
