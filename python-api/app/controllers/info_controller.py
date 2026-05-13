from flask import Blueprint, jsonify
from app.services.external_info_service import ExternalInfoService

info_bp = Blueprint('info', __name__)
info_service = ExternalInfoService()

@info_bp.route('/weather', methods=['GET'])
def get_weather():
    return jsonify(info_service.get_weather_forecast()), 200

@info_bp.route('/news', methods=['GET'])
def get_news():
    return jsonify(info_service.get_community_news()), 200
