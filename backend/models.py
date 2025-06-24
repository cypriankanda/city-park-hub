# backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# Association table for many-to-many Driver <-> Vehicles
vehicle_owner = Table(
    'vehicle_owner', Base.metadata,
    Column('driver_id', Integer, ForeignKey('drivers.id')),
    Column('vehicle_id', Integer, ForeignKey('vehicles.id'))
)

class Driver(Base):
    __tablename__ = 'drivers'
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    hashed_password = Column(String)
    role = Column(String, default='user')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    vehicles = relationship("Vehicle", secondary=vehicle_owner, back_populates="owners")
    bookings = relationship("Booking", back_populates="driver")

class Vehicle(Base):
    __tablename__ = 'vehicles'
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, unique=True, index=True)
    model = Column(String)
    color = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    owners = relationship("Driver", secondary=vehicle_owner, back_populates="vehicles")

class ParkingSpace(Base):
    __tablename__ = 'parking_spaces'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    total_spots = Column(Integer)
    available_spots = Column(Integer)
    price_per_hour = Column(Float)
    features = Column(String)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="parking_space")

class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey('drivers.id'))
    parking_space_id = Column(Integer, ForeignKey('parking_spaces.id'))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    duration_hours = Column(Float)
    status = Column(String, default='active')
    payment_method = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    driver = relationship("Driver", back_populates="bookings")
    parking_space = relationship("ParkingSpace", back_populates="bookings")
