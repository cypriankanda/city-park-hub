from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL is not set in environment variables.")

logger.info(f"Database URL: {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

# Test database connection
try:
    with engine.connect() as connection:
        logger.info("Successfully connected to database")
except Exception as e:
    logger.error(f"Failed to connect to database: {str(e)}")
    logger.warning("Continuing with application startup despite database connection failure")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
