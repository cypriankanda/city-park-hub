from app import create_app as create_app_from_app
from flask import Flask
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

create_app = create_app_from_app()

if __name__ == "__main__":
    try:
        # Get configuration from environment variables
        port = int(os.environ.get('PORT', 5000))
        host = os.environ.get('HOST', '0.0.0.0')
        debug = os.environ.get('FLASK_ENV') != 'production'
        
        # Log startup configuration
        logger.info(f"Starting application with config:")
        logger.info(f"Port: {port}")
        logger.info(f"Host: {host}")
        logger.info(f"Debug mode: {debug}")
        
        # Start the application
        create_app.run(
            host=host,
            port=port,
            debug=debug
        )
        
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        raise
