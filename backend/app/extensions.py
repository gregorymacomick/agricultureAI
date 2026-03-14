from flask_sqlalchemy import SQLAlchemy # pylint: disable=import-error
from flask_jwt_extended import JWTManager # pylint: disable=import-error

db = SQLAlchemy()
jwt = JWTManager()
