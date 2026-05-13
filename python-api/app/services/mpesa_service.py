import requests
from requests.auth import HTTPBasicAuth
import datetime
import base64
import os

class MpesaService:
    """
    Handles Safaricom Daraja API integration for M-Pesa donations.
    Implements STK Push (Lipa Na M-Pesa Online).
    """
    def __init__(self):
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY', 'placeholder_key')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET', 'placeholder_secret')
        self.shortcode = os.getenv('MPESA_SHORTCODE', '174379')
        self.passkey = os.getenv('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
        self.base_url = "https://sandbox.safaricom.co.ke"

    def get_access_token(self):
        """Fetch OAuth access token from Daraja."""
        api_url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        try:
            res = requests.get(api_url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
            return res.json().get('access_token')
        except Exception as e:
            print(f"M-Pesa Token Error: {e}")
            return None

    def initiate_stk_push(self, phone_number, amount, account_ref="LindaJamii"):
        """Trigger an STK Push to the user's phone."""
        access_token = self.get_access_token()
        if not access_token:
            return {"error": "Failed to authenticate with M-Pesa"}, 500

        timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(f"{self.shortcode}{self.passkey}{timestamp}".encode()).decode()
        
        headers = {"Authorization": f"Bearer {access_token}"}
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://api.lindajamii.dev/api/mpesa/callback",
            "AccountReference": account_ref,
            "TransactionDesc": "Donation to LindaJamii Community Safety"
        }

        api_url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        try:
            res = requests.post(api_url, json=payload, headers=headers)
            return res.json(), res.status_code
        except Exception as e:
            return {"error": str(e)}, 500
