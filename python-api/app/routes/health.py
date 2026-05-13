"""Health-check and root info routes."""

from flask import Blueprint, jsonify
import platform, sys, time

health_bp = Blueprint("health", __name__)
_start = time.time()


@health_bp.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "LindaJamii Python API",
        "version": "1.0.0",
        "language": "Python",
        "python_version": sys.version.split()[0],
        "platform": platform.system(),
        "uptime_seconds": round(time.time() - _start, 2),
    })


@health_bp.get("/")
def root():
    return jsonify({
        "name": "LindaJamii API",
        "description": "Community safety & neighbourhood watch REST API",
        "docs": "/api/health",
        "endpoints": [
            "/api/health",
            "/api/incidents",
            "/api/community/members",
            "/api/alerts",
        ],
    })
