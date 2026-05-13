from flask import Blueprint, request, jsonify
from app.services.mpesa_service import MpesaService

mpesa_bp = Blueprint('mpesa', __name__)
mpesa_service = MpesaService()

@mpesa_bp.route('/donate', methods=['POST'])
def donate():
    """
    Endpoint to initiate an M-Pesa donation via STK Push.
    Expects: { "phone": "254712345678", "amount": 100 }
    """
    data = request.get_json()
    phone = data.get('phone')
    amount = data.get('amount')

    if not phone or not amount:
        return jsonify({"error": "Phone number and amount are required"}), 400

    # Ensure phone is in format 254...
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('+'):
        phone = phone[1:]

    result, status_code = mpesa_service.initiate_stk_push(phone, amount)
    return jsonify(result), status_code

@mpesa_bp.route('/callback', methods=['POST'])
def mpesa_callback():
    """
    Callback endpoint for Safaricom to send transaction results.
    """
    data = request.get_json()
    print(f"M-Pesa Callback Received: {data}")
    
    # In a real app, parse data and update database/notify user
    # ResultCode 0 means success
    
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200
