from ..extensions import db
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class FarmProfile(db.Model):
    __tablename__ = 'farm_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Core Crop Info
    crop_type = db.Column(db.String(100), nullable=False)
    
    # Agricultural Features
    farm_size = db.Column(db.Float, nullable=False)  # Size in hectares or acres
    soil_type = db.Column(db.String(50), nullable=True) # e.g., Sandy, Loamy, Clay
    is_active = db.Column(db.Boolean, default=True)
    
    # Location Data
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = db.relationship('User', backref=db.backref('profiles', lazy=True))