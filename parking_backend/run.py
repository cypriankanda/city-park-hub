from app import create_app as create_app_from_app
from flask import Flask
import os

create_app = create_app_from_app()

if __name__ == "__main__":
    # Get the port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Get the host from environment variable or default to localhost
    host = os.environ.get('HOST', '0.0.0.0')
    
    # Check if we're in production
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    create_app.run(
        host=host,
        port=port,
        debug=debug
    )
