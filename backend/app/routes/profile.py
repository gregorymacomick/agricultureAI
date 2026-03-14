from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.user import FarmProfile # Ensure this points to where FarmProfile is defined

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/farm-profile', methods=['POST'])
@jwt_required()
def create_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Updated validation for new fields
    required = ['crop_type', 'farm_size']
    if not all(key in data for key in required):
        return jsonify({"error": "Missing required fields"}), 400

    new_profile = FarmProfile(
        user_id=user_id,
        crop_type=data['crop_type'],
        farm_size=data['farm_size'],
        soil_type=data.get('soil_type'), # Optional field
        latitude=data['latitude'],
        longitude=data['longitude'],
        is_active=data.get('is_active', True)
    )
    
    db.session.add(new_profile)
    db.session.commit()

    return jsonify({"message": "Farm profile created successfully"}), 201