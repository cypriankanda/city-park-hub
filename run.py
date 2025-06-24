from flask import Flask
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add both the current directory and the app directory to PYTHONPATH
src_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(src_dir, 'app')
sys.path.append(src_dir)
sys.path.append(app_dir)

logger.info(f"Python path: {sys.path}")
logger.info(f"Current directory: {os.getcwd()}")
logger.info(f"App directory: {app_dir}")

try:
    from app import create_app as create_app_from_app
except ImportError as e:
    logger.error(f"Failed to import app module: {str(e)}")
    logger.error(f"Current directory contents: {os.listdir()}")
    logger.error(f"App directory contents: {os.listdir('app')}")
    raise

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
