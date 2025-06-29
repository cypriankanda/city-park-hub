# backend/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# ------------------ Authentication ------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    confirm_password: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class VerifyResetRequest(BaseModel):
    token: str
    new_password: str

class Token(BaseModel):
    token: str
    user: 'User'
    expires_in: int

# ------------------ Core Models ------------------
class User(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str]
    role: str
    hashed_password: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Booking(BaseModel):
    id: int
    driver_id: int
    parking_space_id: int
    start_time: datetime
    end_time: datetime
    duration_hours: float
    status: str
    payment_method: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ParkingSpot(BaseModel):
    id: int
    name: str
    address: str
    latitude: float
    longitude: float
    available_spots: int
    total_spots: int
    price_per_hour: float
    features: str
    rating: float
    created_at: datetime
    updated_at: datetime
    distance: Optional[str] = None
    walk_time: Optional[str] = None

    class Config:
        from_attributes = True

class AdminActivity(BaseModel):
    id: int
    action: str
    user: Optional[str]
    location: Optional[str]
    amount: Optional[str]
    time: str
    type: str

    class Config:
        from_attributes = True

class ParkingLocation(BaseModel):
    id: int
    name: str
    address: str
    total_spots: int
    occupied_spots: int
    revenue_today: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ------------------ Request DTOs ------------------
class CreateBookingRequest(BaseModel):
    parking_space_id: int
    start_time: datetime
    end_time: datetime
    duration_hours: float

class UpdateBookingRequest(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class ExtendBookingRequest(BaseModel):
    additional_hours: float

class BookSpotRequest(BaseModel):
    start_time: datetime
    duration_hours: float

class LocationRequest(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    total_spots: Optional[int] = None
    price_per_hour: Optional[float] = None

Token.update_forward_refs()
