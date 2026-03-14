# app/routes/__init__.py
# This file makes 'routes' a package and exposes the blueprints for easy import

from .auth import auth_bp
from .profile import profile_bp
from .predictions import predict_bp

# Optional: you can add more blueprints here later, e.g.
# from .marketplace import marketplace_bp