from flask import request, jsonify
from werkzeug.exceptions import HTTPException
import logging

def handle_error(error):
    if isinstance(error, HTTPException):
        return jsonify(
            error=str(error),
            message=error.description
        ), error.code
    
    # Log the error
    logging.error(f"Unexpected error: {str(error)}")
    return jsonify(
        error="Internal Server Error",
        message="An unexpected error occurred"
    ), 500

def validate_request_data(required_fields):
    def decorator(func):
        def wrapper(*args, **kwargs):
            data = request.get_json()
            if not data:
                return jsonify(
                    error="Bad Request",
                    message="Request must be JSON"
                ), 400
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify(
                    error="Bad Request",
                    message=f"Missing required fields: {', '.join(missing_fields)}"
                ), 400
            
            return func(*args, **kwargs)
        
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator

def validate_email(email):
    """Basic email validation"""
    if not email or '@' not in email:
        return False
    return True

def validate_password(password):
    """Basic password validation"""
    if not password or len(password) < 8:
        return False
    return True
