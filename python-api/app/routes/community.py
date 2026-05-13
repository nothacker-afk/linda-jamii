"""Community members routes."""

from flask import Blueprint, jsonify
from ..models.store import get_members

community_bp = Blueprint("community", __name__)


@community_bp.get("/members")
def list_members():
    """Return all community members."""
    members = get_members()
    return jsonify({
        "total": len(members),
        "members": members,
    })


@community_bp.get("/stats")
def community_stats():
    """Return aggregated community statistics."""
    members = get_members()
    roles = {}
    neighbourhoods = {}
    for m in members:
        roles[m["role"]] = roles.get(m["role"], 0) + 1
        neighbourhoods[m["neighbourhood"]] = neighbourhoods.get(m["neighbourhood"], 0) + 1

    return jsonify({
        "total_members": len(members),
        "roles_breakdown": roles,
        "neighbourhoods": neighbourhoods,
    })
