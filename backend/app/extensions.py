from flask_sqlalchemy import SQLAlchemy # pylint: disable=import-error
from flask_jwt_extended import JWTManager # pylint: disable=import-error
# backend/app/__init__.py or extensions.py
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # Allow the specific origin of your frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    # ... rest of setup

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()  # We'll configure origins later