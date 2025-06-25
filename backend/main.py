# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from backend import models, schemas, crud
from .database import SessionLocal, engine
from .auth import get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/bookings")
def create_booking(data: schemas.CreateBookingRequest, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        print("Incoming booking request:", data)
        spot = db.query(models.ParkingSpace).filter_by(id=data.parking_space_id).first()
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
            parking_space_id=data.parking_space_id,
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
        print("Booking creation failed:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
