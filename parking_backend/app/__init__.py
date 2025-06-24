from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api
from dotenv import load_dotenv
import os

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    load_dotenv()
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')
    
    # Database configuration
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        # Heroku and some other platforms prefix with postgres://
        if db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://')
        app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///parking.db'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
    
    # Rate limiting configuration
    app.config['RATELIMIT_STORAGE_URL'] = os.getenv('RATELIMIT_STORAGE_URL', 'memory://')
    app.config['RATELIMIT_DEFAULT'] = '1000 per day;100 per hour'
    app.config['RATELIMIT_HEADERS_ENABLED'] = True
    
    # Logging configuration
    if app.config['ENV'] == 'production':
        import logging
        from logging.handlers import RotatingFileHandler
        handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
        app.logger.setLevel(logging.INFO)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.routes import register_routes
    register_routes(app)

    return app
