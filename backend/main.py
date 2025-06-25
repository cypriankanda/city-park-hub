# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from backend import models, schemas, crud
from .database import SessionLocal, engine
from .auth import get_current_user

# Initialize database
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title="City Park Hub API", version="1.0.0")

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://city-park-hub-1rf7.onrender.com",
        "https://*.vercel.app",
        "https://*.vercel.live"
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
    return crud.login_user(db, data)

@app.post("/api/auth/register")
async def register(data: schemas.RegisterRequest, db: Session = Depends(get_db)):
    try:
        return crud.register_user(db, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
def list_bookings(status: str = "all", search: str = "", current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_bookings(db, current_user, status, search)

@app.post("/api/bookings")
def create_booking(data: schemas.CreateBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        spot = db.query(models.ParkingSpace).filter_by(id=data.parking_spot_id).first()
        if not spot:
            raise HTTPException(status_code=404, detail="Parking spot not found")
        if spot.available_spots <= 0:
            raise HTTPException(status_code=400, detail="No available spots")
        if data.start_time >= data.end_time:
            raise HTTPException(status_code=400, detail="Start time must be before end time")
        if data.duration_hours <= 0:
            raise HTTPException(status_code=400, detail="Duration must be greater than 0")

        booking = models.Booking(
            driver_id=current_user.id,
            parking_space_id=data.parking_spot_id,
            start_time=data.start_time,
            end_time=data.end_time,
            duration_hours=data.duration_hours,
            payment_method="M-Pesa",
            status="pending"
        )
        spot.available_spots -= 1
        db.add(booking)
        db.commit()
        db.refresh(booking)

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
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/bookings/{booking_id}")
def update_booking(booking_id: int, data: schemas.UpdateBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.update_booking(db, current_user, booking_id, data)

@app.delete("/api/bookings/{booking_id}")
def delete_booking(booking_id: int, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.delete_booking(db, current_user, booking_id)

@app.post("/api/bookings/{booking_id}/extend")
def extend_booking(booking_id: int, data: schemas.ExtendBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.extend_booking(db, current_user, booking_id, data)

# -------------------- PARKING ROUTES --------------------

@app.get("/api/parking/spots")
def list_parking_spots(lat: float = None, lng: float = None, radius: float = 5, search: str = "", filter: str = "available", db: Session = Depends(get_db)):
    return crud.get_parking_spots(db, lat, lng, radius, search, filter)

@app.get("/api/parking/spots/{spot_id}")
def get_parking_spot(spot_id: int, db: Session = Depends(get_db)):
    return crud.get_parking_spot(db, spot_id)

@app.post("/api/parking/spots/{spot_id}/book")
def book_spot(spot_id: int, data: schemas.BookSpotRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.book_parking_spot(db, current_user, spot_id, data)

# -------------------- ADMIN ROUTES --------------------

@app.get("/api/admin/stats")
def admin_stats(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_admin_stats(db)

@app.get("/api/admin/activities")
def admin_activities(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_admin_activities(db)

@app.get("/api/admin/locations")
def list_locations(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.list_parking_locations(db)

@app.post("/api/admin/locations")
def create_location(data: schemas.LocationRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_location(db, data)

@app.put("/api/admin/locations/{location_id}")
def update_location(location_id: int, data: schemas.LocationRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.update_location(db, location_id, data)
