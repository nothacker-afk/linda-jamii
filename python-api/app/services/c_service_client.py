import requests

class CServiceClient:
    """
    Client to interact with the C Micro-Service (port 8090).
    Demonstrates cross-language integration.
    """
    BASE_URL = "http://localhost:8090"

    def get_health(self):
        try:
            response = requests.get(f"{self.BASE_URL}/health")
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def compute_hash(self, text):
        try:
            response = requests.get(f"{self.BASE_URL}/hash", params={"text": text})
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_stats(self):
        try:
            response = requests.get(f"{self.BASE_URL}/stats")
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}
