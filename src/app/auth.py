from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from .models import Driver, db
from datetime import datetime

import logging

logger = logging.getLogger(__name__)

def register():
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['email', 'password', 'name']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        if not data['email'] or not data['password']:
            return jsonify({'error': 'Email and password are required'}), 400
            
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
            
        existing_user = Driver.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400
            
        new_user = Driver(
            name=data['name'],
            email=data['email']
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"User registered: {data['email']}")
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

def login():
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400
            
        user = Driver.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
            
        access_token = create_access_token(identity=user.id)
        
        logger.info(f"User logged in: {data['email']}")
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500
