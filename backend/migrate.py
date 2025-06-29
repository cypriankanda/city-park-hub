from backend.database import engine, Base
from backend.models import Driver, Vehicle, ParkingSpace, Booking
import logging

logger = logging.getLogger(__name__)

def create_tables():
    """Create all database tables if they don't exist."""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to create database tables: {str(e)}", exc_info=True)
        return False

def check_tables():
    """Check if tables exist in the database."""
    try:
        with engine.connect() as connection:
            inspector = connection.dialect.inspector(connection)
            tables = inspector.get_table_names()
            logger.info(f"Existing tables: {tables}")
            return tables
    except Exception as e:
        logger.error(f"Failed to check tables: {str(e)}", exc_info=True)
        return []

if __name__ == "__main__":
    logger.info("Starting database migration...")
    tables = check_tables()
    if not tables:
        logger.info("No tables found, creating them...")
        create_tables()
    else:
        logger.info("Tables already exist")
