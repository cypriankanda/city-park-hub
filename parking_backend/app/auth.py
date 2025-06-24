from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.models import Driver
from app import db
from app.middleware import validate_request_data, validate_email, validate_password
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limits
RATE_LIMITS = {
    'register': '100/day;10/hour',
    'login': '200/day;20/hour',
    'reset_password': '50/day;5/hour'
}

@validate_request_data(['name', 'email', 'password'])
def register():
    try:
        data = request.get_json()
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify(
                error="Invalid Request",
                message="Invalid email format"
            ), 400
            
        # Validate password
        if not validate_password(data['password']):
            return jsonify(
                error="Invalid Request",
                message="Password must be at least 8 characters long"
            ), 400
            
        # Check if user already exists
        if Driver.query.filter_by(email=data['email']).first():
            return jsonify(
                error="Conflict",
                message="User already exists"
            ), 409
            
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = Driver(
            name=data['name'],
            email=data['email'],
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"New user registered: {data['email']}")
        return jsonify(
            message="Driver registered successfully",
            user_id=new_user.id
        ), 201
        
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        db.session.rollback()
        return jsonify(
            error="Internal Server Error",
            message="An error occurred during registration"
        ), 500

@validate_request_data(['email', 'password'])
def login():
    try:
        data = request.get_json()
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify(
                error="Invalid Request",
                message="Invalid email format"
            ), 400
            
        # Authenticate user
        user = Driver.query.filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password, data['password']):
            logger.warning(f"Failed login attempt for email: {data['email']}")
            return jsonify(
                error="Unauthorized",
                message="Invalid credentials"
            ), 401
            
        # Create JWT token
        token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )
        
        logger.info(f"User logged in: {data['email']}")
        return jsonify(
            access_token=token,
            user_id=user.id,
            message="Login successful"
        ), 200
        
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify(
            error="Internal Server Error",
            message="An error occurred during login"
        ), 500
