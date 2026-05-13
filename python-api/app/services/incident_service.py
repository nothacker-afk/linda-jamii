import uuid
import time

class IncidentService:
    def __init__(self):
        # In a real app, this would interface with a Repository and a Task Queue (Celery/Redis)
        pass

    def enqueue_incident_processing(self, incident_data):
        """
        Simulates enqueuing a task to a background worker.
        """
        job_id = str(uuid.uuid4())
        print(f"DEBUG: Enqueuing incident processing job: {job_id}")
        
        # Simulate background processing (e.g., sending to RabbitMQ/Redis)
        # In a real app: task = process_incident.delay(incident_data)
        
        return job_id

    def get_all_incidents(self):
        # Placeholder for repository call
        return {
            "total": 2,
            "incidents": [
                {"id": 1, "title": "Suspicious Activity", "status": "processed"},
                {"id": 2, "title": "Water Leak", "status": "pending"}
            ]
        }
