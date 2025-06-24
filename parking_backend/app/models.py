from app import db
from datetime import datetime

driver_vehicle = db.Table('driver_vehicle',
    db.Column('driver_id', db.Integer, db.ForeignKey('drivers.id')),
    db.Column('vehicle_id', db.Integer, db.ForeignKey('vehicles.id'))
)

class Driver(db.Model):
    __tablename__ = 'drivers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    bookings = db.relationship('Booking', backref='driver', lazy=True)
    vehicles = db.relationship('Vehicle', secondary=driver_vehicle, backref='owners')

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    vehicle_type = db.Column(db.String(20))

class ParkingSpace(db.Model):
    __tablename__ = 'parking_spaces'
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))
    status = db.Column(db.String(20), default='available')
    bookings = db.relationship('Booking', backref='parking_space', lazy=True)

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    parking_space_id = db.Column(db.Integer, db.ForeignKey('parking_spaces.id'), nullable=False)
