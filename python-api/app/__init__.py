"""
LindaJamii Python API
Flask application factory.
"""

from flask import Flask
from flask_cors import CORS

from .routes.incidents import incidents_bp
from .routes.community import community_bp
from .routes.alerts import alerts_bp
from .routes.health import health_bp


def create_app(config_name: str = "development") -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ── Configuration ────────────────────────────────────────────────
    app.config.update(
        SECRET_KEY="lindajamii-secret-2025",
        JSON_SORT_KEYS=False,
        DEBUG=(config_name == "development"),
    )

    # ── Register blueprints ──────────────────────────────────────────
    app.register_blueprint(health_bp,    url_prefix="/api")
    app.register_blueprint(incidents_bp, url_prefix="/api/incidents")
    app.register_blueprint(community_bp, url_prefix="/api/community")
    app.register_blueprint(alerts_bp,    url_prefix="/api/alerts")

    return app
