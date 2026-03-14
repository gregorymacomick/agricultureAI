from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.user import FarmProfile

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/farm-profile', methods=['POST'])
@jwt_required()
def create_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ['crop_type', 'farm_size', 'latitude', 'longitude']
    if not all(key in data for key in required):
        return jsonify({"error": "Missing required fields"}), 400

    # Optional: check if similar profile already exists (prevent duplicates)
    existing = FarmProfile.query.filter_by(
        user_id=user_id,
        crop_type=data['crop_type'],
        latitude=data['latitude'],
        longitude=data['longitude']
    ).first()

    if existing:
        return jsonify({"error": "A similar farm profile already exists"}), 409

    new_profile = FarmProfile(
        user_id=user_id,
        crop_type=data['crop_type'],
        farm_size=data['farm_size'],
        soil_type=data.get('soil_type'),
        latitude=data['latitude'],
        longitude=data['longitude'],
        is_active=data.get('is_active', True)
    )
    
    db.session.add(new_profile)
    db.session.commit()

    return jsonify({
        "message": "Farm profile created successfully",
        "profile": {
            "id": new_profile.id,
            "crop_type": new_profile.crop_type,
            "farm_size": new_profile.farm_size,
            "soil_type": new_profile.soil_type,
            "latitude": new_profile.latitude,
            "longitude": new_profile.longitude,
            "created_at": new_profile.created_at.isoformat()
        }
    }), 201


@profile_bp.route('/farm-profiles', methods=['GET'])
@jwt_required()
def list_profiles():
    user_id = get_jwt_identity()
    
    profiles = FarmProfile.query.filter_by(user_id=user_id).all()
    
    return jsonify([
        {
            "id": p.id,
            "crop_type": p.crop_type,
            "farm_size": p.farm_size,
            "soil_type": p.soil_type,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "is_active": p.is_active,
            "created_at": p.created_at.isoformat()
        } for p in profiles
    ]), 200


@profile_bp.route('/farm-profile/<int:profile_id>', methods=['DELETE'])
@jwt_required()
def delete_profile(profile_id):
    user_id = get_jwt_identity()
    
    profile = FarmProfile.query.filter_by(id=profile_id, user_id=user_id).first()
    
    if not profile:
        return jsonify({"error": "Profile not found or not owned by user"}), 404
    
    db.session.delete(profile)
    db.session.commit()
    
    return jsonify({"message": "Farm profile deleted successfully"}), 200