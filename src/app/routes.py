from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from .auth import register, login
from .models import db, Driver

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/register', methods=['POST'])
def handle_register():
    return register()

@auth_bp.route('/api/auth/login', methods=['POST'])
def handle_login():
    return login()

@auth_bp.route('/api/auth/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

def register_routes(app):
    app.register_blueprint(auth_bp)
