from flask import Flask
from .config import config
from .extensions import db, jwt, cors
from .routes import auth_bp, profile_bp, predict_bp  #pylint: disable=import-error

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={
    r"/api/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
    }) # MVP: allow all; tighten later

    # Register blueprints (modular routes)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(predict_bp, url_prefix='/api')

    @app.route('/health')
    def health():
        return {"status": "healthy", "message": "AgriAI backend running"}, 200

    return app