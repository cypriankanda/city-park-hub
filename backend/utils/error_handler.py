from fastapi import HTTPException
from typing import Callable, Any
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def handle_exceptions(func: Callable) -> Callable:
    """Decorator to handle exceptions and log them."""
    @wraps(func)
    async def wrapper(*args, **kwargs) -> Any:
        try:
            return await func(*args, **kwargs)
        except HTTPException as e:
            logger.error(f"{func.__name__} failed: {str(e.detail)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")
    return wrapper
