# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from backend import models, schemas, crud  # ✅ assuming your backend folder is named `backend`
from .database import SessionLocal, engine
from .auth import get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Local development
        "https://city-park-hub-1rf7.onrender.com",  # Backend
        "https://*.vercel.app",  # Vercel deployment
        "https://*.vercel.live"   # Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Authorization"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication Routes
@app.get("/")
def root():
    return {"message": "ParkSmart API is running"}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    return crud.login_user(db, data)

@app.post("/api/auth/register", response_model=schemas.Token)
def register(data: schemas.RegisterRequest, db: Session = Depends(get_db)):
    return crud.register_user(db, data)

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

# Dashboard Routes
@app.get("/api/dashboard/stats")
def get_stats(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_dashboard_stats(db, current_user)

@app.get("/api/dashboard/recent-bookings")
def recent_bookings(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_recent_bookings(db, current_user)

# Bookings Routes
@app.get("/api/bookings")
def list_bookings(status: str = "all", search: str = "", current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_bookings(db, current_user, status, search)

@app.post("/api/bookings")
def create_booking(data: schemas.CreateBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_booking(db, current_user, data)

@app.put("/api/bookings/{booking_id}")
def update_booking(booking_id: int, data: schemas.UpdateBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.update_booking(db, current_user, booking_id, data)

@app.delete("/api/bookings/{booking_id}")
def delete_booking(booking_id: int, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.delete_booking(db, current_user, booking_id)

@app.post("/api/bookings/{booking_id}/extend")
def extend_booking(booking_id: int, data: schemas.ExtendBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.extend_booking(db, current_user, booking_id, data)

# Parking Routes
@app.get("/api/parking/spots")
def list_parking_spots(lat: float = None, lng: float = None, radius: float = 5, search: str = "", filter: str = "available", db: Session = Depends(get_db)):
    return crud.get_parking_spots(db, lat, lng, radius, search, filter)

@app.get("/api/parking/spots/{spot_id}")
def get_parking_spot(spot_id: int, db: Session = Depends(get_db)):
    return crud.get_parking_spot(db, spot_id)

@app.post("/api/parking/spots/{spot_id}/book")
def book_spot(spot_id: int, data: schemas.BookSpotRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.book_parking_spot(db, current_user, spot_id, data)

# Admin Routes
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
