from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import FarmProfile

predict_bp = Blueprint('predictions', __name__)

@predict_bp.route('/predict/<int:profile_id>', methods=['GET'])
@jwt_required()
def get_prediction(profile_id):
    user_id = get_jwt_identity()
    profile = FarmProfile.query.filter_by(id=profile_id, user_id=user_id).first()

    if not profile:
        return jsonify({"error": "Farm profile not found"}), 404

    # This is a placeholder for your AI logic/Model inference
    # Example: result = my_ai_model.predict(profile.crop_type, profile.soil_type)
    prediction_data = {
        "crop": profile.crop_type,
        "recommended_action": "Increase irrigation by 10%",
        "estimated_yield": f"{profile.farm_size * 1.5} tons",
        "soil_status": profile.soil_type
    }

    return jsonify(prediction_data), 200