"""
Backend package initialization
"""

from .main import app
from .database import SessionLocal, engine
from .models import Base
from .auth import get_current_user

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

__all__ = [
    'app',
    'get_current_user'
]