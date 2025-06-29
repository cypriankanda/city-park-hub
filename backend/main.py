# backend/main.py
import logging
from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from backend.models import Driver, ParkingSpace, Booking
from backend.schemas import LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyResetRequest, User, CreateBookingRequest, UpdateBookingRequest, ExtendBookingRequest, BookSpotRequest, LocationRequest
from backend.database import SessionLocal, engine
from backend.auth import get_current_user

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
models.Base.metadata.create_all(bind=engine)

# Test database connection
try:
    with engine.connect() as connection:
        logger.info("Successfully connected to database")
except Exception as e:
    logger.error(f"Failed to connect to database: {str(e)}")

# Create FastAPI app
app = FastAPI(title="City Park Hub API", version="1.0.0")

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Vite dev server
        "https://city-park-hub-1rf7.onrender.com",
        "https://*.vercel.app",
        "https://*.vercel.live",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization", "Content-Type", "Accept"],
    max_age=86400
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- AUTH ROUTES --------------------

@app.get("/")
def root():
    return {"message": "ParkSmart API is running"}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Login attempt for email: {data.email}")
        result = crud.login_user(db, data)
        logger.info("Login successful")
        return result
    except HTTPException as e:
        logger.error(f"Login failed: {str(e.detail)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/auth/register")
async def register(data: schemas.RegisterRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Registration attempt for email: {data.email}")
        result = crud.register_user(db, data)
        logger.info("Registration successful")
        return result
    except HTTPException as e:
        logger.error(f"Registration failed: {str(e.detail)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/auth/reset-password")
def reset_password(data: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    return crud.send_reset_email(db, data)

@app.post("/api/auth/verify-reset")
def verify_reset(data: schemas.VerifyResetRequest, db: Session = Depends(get_db)):
    return crud.verify_reset(db, data)

@app.get("/api/auth/me", response_model=schemas.User)
def get_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.post("/api/auth/logout")
def logout():
    return {"message": "Logged out successfully"}

# -------------------- DASHBOARD ROUTES --------------------

@app.get("/api/dashboard/stats")
def get_stats(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_dashboard_stats(db, current_user)

@app.get("/api/dashboard/recent-bookings")
def recent_bookings(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_recent_bookings(db, current_user)

# -------------------- BOOKINGS ROUTES --------------------

@app.get("/api/bookings")
def list_bookings(
    status: str = "all", 
    search: str = "", 
    local_kw: str = None,
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return crud.get_user_bookings(db, current_user, status, search)

@app.post("/api/bookings")
def create_booking(
    data: schemas.CreateBookingRequest, 
    local_kw: str = "NAIROBI",
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Creating booking for user {current_user.id}, local_kw: {local_kw}")
        logger.info(f"Booking data: parking_space_id={data.parking_space_id}, duration={data.duration_hours}")
        
        # Validate parking space exists
        spot = db.query(models.ParkingSpace).filter(models.ParkingSpace.id == data.parking_space_id).first()
        if not spot:
            logger.error(f"Parking spot {data.parking_space_id} not found")
            raise HTTPException(status_code=404, detail="Parking spot not found")
        
        # Check availability
        if spot.available_spots <= 0:
            logger.error(f"No available spots for parking space {data.parking_space_id}")
            raise HTTPException(status_code=400, detail="No available spots")
        
        # Validate time constraints
        if data.start_time >= data.end_time:
            logger.error("Invalid time range: start_time >= end_time")
            raise HTTPException(status_code=400, detail="Start time must be before end time")
        
        if data.duration_hours <= 0:
            logger.error(f"Invalid duration: {data.duration_hours}")
            raise HTTPException(status_code=400, detail="Duration must be greater than 0")

        # Create booking
        booking = models.Booking(
            driver_id=current_user.id,
            parking_space_id=data.parking_space_id,
            start_time=data.start_time,
            end_time=data.end_time,
            duration_hours=data.duration_hours,
            status="active",
            payment_method="card"
        )
        
        # Update available spots
        spot.available_spots -= 1
        
        # Save to database
        db.add(booking)
        db.commit()
        db.refresh(booking)
        
        logger.info(f"Booking created successfully: {booking.id}")

        return {
            "booking": {
                "id": booking.id,
                "parking_spot_id": booking.parking_space_id,
                "start_time": booking.start_time,
                "end_time": booking.end_time,
                "duration_hours": booking.duration_hours,
                "status": booking.status
            }
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Booking creation failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.put("/api/bookings/{booking_id}")
def update_booking(
    booking_id: int, 
    data: schemas.UpdateBookingRequest, 
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.update_booking(db, current_user, booking_id, data)
    except Exception as e:
        logger.error(f"Booking update failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/bookings/{booking_id}")
def delete_booking(
    booking_id: int, 
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.delete_booking(db, current_user, booking_id)
    except Exception as e:
        logger.error(f"Booking deletion failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/bookings/{booking_id}/extend")
def extend_booking(
    booking_id: int, 
    data: schemas.ExtendBookingRequest, 
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.extend_booking(db, current_user, booking_id, data)
    except Exception as e:
        logger.error(f"Booking extension failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- PARKING ROUTES --------------------

@app.get("/api/parking/spots")
def list_parking_spots(
    lat: float = None, 
    lng: float = None, 
    radius: float = 5, 
    search: str = "", 
    filter: str = "available", 
    db: Session = Depends(get_db)
):
    try:
        return crud.get_parking_spots(db, lat, lng, radius, search, filter)
    except Exception as e:
        logger.error(f"Failed to get parking spots: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/parking/spots/{spot_id}")
def get_parking_spot(spot_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_parking_spot(db, spot_id)
    except Exception as e:
        logger.error(f"Failed to get parking spot {spot_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parking/spots/{spot_id}/book")
def book_spot(
    spot_id: int, 
    data: schemas.BookSpotRequest, 
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.book_parking_spot(db, current_user, spot_id, data)
    except Exception as e:
        logger.error(f"Failed to book spot {spot_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- ADMIN ROUTES --------------------

@app.get("/api/admin/stats")
def admin_stats(
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.get_admin_stats(db)
    except Exception as e:
        logger.error(f"Failed to get admin stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/activities")
def admin_activities(
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.get_admin_activities(db)
    except Exception as e:
        logger.error(f"Failed to get admin activities: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/locations")
def list_locations(
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.list_parking_locations(db)
    except Exception as e:
        logger.error(f"Failed to list locations: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/locations")
def create_location(
    data: schemas.LocationRequest, 
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.create_location(db, data)
    except Exception as e:
        logger.error(f"Failed to create location: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/locations/{location_id}")
def update_location(
    location_id: int, 
    data: schemas.LocationRequest, 
    current_user: schemas.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    try:
        return crud.update_location(db, location_id, data)
    except Exception as e:
        logger.error(f"Failed to update location {location_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- HEALTH CHECK --------------------

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "City Park Hub API"}

# -------------------- DEBUG ENDPOINT (Remove in production) --------------------

@app.get("/api/debug/parking-spaces")
def debug_parking_spaces(db: Session = Depends(get_db)):
    """Debug endpoint to check parking spaces in database"""
    try:
        spaces = db.query(models.ParkingSpace).all()
        return {
            "total_spaces": len(spaces),
            "spaces": [{"id": s.id, "name": getattr(s, 'name', 'Unknown'), "available_spots": s.available_spots} for s in spaces[:5]]
        }
    except Exception as e:
        logger.error(f"Debug endpoint failed: {str(e)}", exc_info=True)
        return {"error": str(e)}