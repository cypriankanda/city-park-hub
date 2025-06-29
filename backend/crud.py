# backend/crud.py
import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta
from backend import models, schemas
from backend.schemas import RegisterRequest, LoginRequest, ResetPasswordRequest, VerifyResetRequest, CreateBookingRequest, UpdateBookingRequest, ExtendBookingRequest, BookSpotRequest, LocationRequest
from backend.auth import get_password_hash, verify_password, create_access_token
from sqlalchemy import or_
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ------------------ AUTH ------------------
def register_user(db: Session, data: RegisterRequest):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if db.query(models.Driver).filter_by(email=data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = get_password_hash(data.password)
    new_user = models.Driver(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_data = schemas.User.from_orm(new_user).model_dump()
    access_token = create_access_token({"sub": new_user.email, "user": user_data})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data,
        "expires_in": 1800
    }

def login_user(db: Session, data: LoginRequest):
    try:
        user = db.query(models.Driver).filter_by(email=data.email).first()
        if not user:
            logger.info(f"Login failed: User not found for email {data.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not verify_password(data.password, user.hashed_password):
            logger.info(f"Login failed: Invalid password for user {user.id}")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        user_data = schemas.User.from_orm(user).model_dump()
        access_token = create_access_token({"sub": user.email, "user": user_data})
        logger.info(f"Login successful for user {user.id}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_data,
            "expires_in": 1800
        }
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}", exc_info=True)
        raise

def send_reset_email(db: Session, data: ResetPasswordRequest):
    # Stubbed for now (implement email later)
    return {"message": "Password reset instructions sent to email.", "success": True}

def verify_reset(db: Session, data: VerifyResetRequest):
    # Stubbed reset confirmation (no token validation yet)
    return {"message": "Password reset successful.", "success": True}

# ------------------ DASHBOARD ------------------
def get_user_dashboard_stats(db: Session, user):
    count = db.query(models.Booking).filter_by(driver_id=user.id).count()
    return {
        "total_bookings": count,
        "money_saved": count * 20,  # placeholder
        "hours_saved": count * 2,   # placeholder
        "favorite_spots": 1         # placeholder
    }

def get_recent_bookings(db: Session, user):
    return db.query(models.Booking).filter_by(driver_id=user.id).order_by(models.Booking.created_at.desc()).limit(5).all()

# ------------------ BOOKINGS ------------------
def get_user_bookings(db: Session, user, status, search):
    query = db.query(models.Booking).filter(models.Booking.driver_id == user.id)
    if status != "all":
        query = query.filter(models.Booking.status == status)
    if search:
        query = query.filter(or_(models.Booking.location.ilike(f"%{search}%")))
    return query.all()

def create_booking(db: Session, user, data: CreateBookingRequest):
    spot = db.query(models.ParkingSpace).filter_by(id=data.parking_space_id).first()
    if not spot or spot.available_spots <= 0:
        raise HTTPException(status_code=404, detail="Spot not available")

    booking = models.Booking(
        driver_id=user.id,
        parking_space_id=data.parking_space_id,
        start_time=data.start_time,
        end_time=data.end_time,
        duration_hours=data.duration_hours,
        payment_method="card"  # Updated to match frontend
    )
    spot.available_spots -= 1
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"booking": booking}

def update_booking(db: Session, user, booking_id, data: UpdateBookingRequest):
    booking = db.query(models.Booking).filter_by(id=booking_id, driver_id=user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if data.start_time:
        booking.start_time = data.start_time
    if data.end_time:
        booking.end_time = data.end_time
    db.commit()
    db.refresh(booking)
    return {"booking": booking}

def delete_booking(db: Session, user, booking_id):
    booking = db.query(models.Booking).filter_by(id=booking_id, driver_id=user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled"}

def extend_booking(db: Session, user, booking_id, data: ExtendBookingRequest):
    booking = db.query(models.Booking).filter_by(id=booking_id, driver_id=user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.duration_hours += data.additional_hours
    db.commit()
    db.refresh(booking)
    return {"booking": booking, "additional_cost": data.additional_hours * 20}

# ------------------ PARKING ------------------
def get_parking_spots(db: Session, lat: Optional[float], lng: Optional[float], radius: float, search: str, filter: str):
    try:
        query = db.query(models.ParkingSpace)
        
        # Apply location filter if coordinates are provided
        if lat is not None and lng is not None:
            query = query.filter(
                models.ParkingSpace.latitude.between(lat - radius, lat + radius),
                models.ParkingSpace.longitude.between(lng - radius, lng + radius)
            )
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    models.ParkingSpace.name.ilike(f"%{search}%"),
                    models.ParkingSpace.address.ilike(f"%{search}%")
                )
            )
        
        # Apply status filter
        if filter == "available":
            query = query.filter(models.ParkingSpace.available_spots > 0)
        elif filter == "full":
            query = query.filter(models.ParkingSpace.available_spots == 0)
        
        return query.all()
        
    except Exception as e:
        logger.error(f"Error in get_parking_spots: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch parking spots")

def get_parking_spot(db: Session, spot_id):
    return db.query(models.ParkingSpace).filter_by(id=spot_id).first()

def book_parking_spot(db: Session, user, spot_id, data: BookSpotRequest):
    return create_booking(db, user, schemas.CreateBookingRequest(
        parking_space_id=spot_id,
        start_time=data.start_time,
        end_time=data.start_time + timedelta(hours=data.duration_hours),
        duration_hours=data.duration_hours
    ))

# ------------------ ADMIN ------------------
def get_admin_stats(db: Session):
    return {
        "total_users": db.query(models.Driver).count(),
        "active_bookings": db.query(models.Booking).filter_by(status='active').count(),
        "revenue_today": 5000.00,  # Placeholder
        "total_parking_spots": db.query(models.ParkingSpace).count()
    }

def get_admin_activities(db: Session):
    return []  # Placeholder

def list_parking_locations(db: Session):
    return db.query(models.ParkingSpace).all()

def create_location(db: Session, data: LocationRequest):
    location = models.ParkingSpace(**data.dict(exclude_unset=True))
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

def update_location(db: Session, location_id, data: LocationRequest):
    location = db.query(models.ParkingSpace).filter_by(id=location_id).first()
    for key, value in data.dict(exclude_unset=True).items():
        setattr(location, key, value)
    db.commit()
    db.refresh(location)
    return location
