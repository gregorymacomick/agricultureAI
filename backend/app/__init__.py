# app/__init__.py

from flask import Flask
from flask_cors import CORS
from .config import config
from .extensions import db, jwt                    
from .routes import auth_bp, profile_bp, predict_bp

# Import CORS directly here (best practice)


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # ── Single, clear CORS configuration ──
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://agriculture-ai-omega.vercel.app",
                # Add your production frontend domain later, e.g. "https://your-app.vercel.app"
            ],
            "allow_headers": ["Content-Type", "Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "supports_credentials": True   # Important if you ever send cookies or auth headers
        }
    })

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(predict_bp, url_prefix='/api')

    @app.route('/health')
    def health():
        return {"status": "healthy", "message": "AgriAI backend running"}, 200

    return app