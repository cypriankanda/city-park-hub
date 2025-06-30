
from backend import models, auth
from backend.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Only seed if not already present
if not db.query(models.Driver).filter_by(email="admin@parksmart.com").first():
    # Create admin user
    admin = models.Driver(
        full_name="Admin User",
        email="admin@parksmart.com",
        phone="+254700000000",
        hashed_password=auth.get_password_hash("admin123"),
        role="admin"
    )
    db.add(admin)

    # Create demo user
    demo_user = models.Driver(
        full_name="Demo User",
        email="demo@parksmart.com",
        phone="+254700000001",
        hashed_password=auth.get_password_hash("demo123"),
        role="user"
    )
    db.add(demo_user)

    # Create parking spots
    spots = [
        models.ParkingSpace(
            name="Kenyatta Ave Parking",
            address="Kenyatta Avenue, Nairobi",
            latitude=-1.2921,
            longitude=36.8219,
            total_spots=20,
            available_spots=18,
            price_per_hour=50,
            features="Covered,Security,24/7"
        ),
        models.ParkingSpace(
            name="Uhuru Park Parking",
            address="Uhuru Highway, Nairobi",
            latitude=-1.2841,
            longitude=36.8155,
            total_spots=30,
            available_spots=25,
            price_per_hour=40,
            features="Open Air,Security,CCTV"
        ),
        models.ParkingSpace(
            name="CBD Shopping Mall",
            address="Moi Avenue, Nairobi",
            latitude=-1.2833,
            longitude=36.8167,
            total_spots=50,
            available_spots=35,
            price_per_hour=60,
            features="Covered,Mall Access,Security,Elevator"
        ),
        models.ParkingSpace(
            name="Westlands Square",
            address="Westlands Road, Nairobi",
            latitude=-1.2630,
            longitude=36.8063,
            total_spots=40,
            available_spots=28,
            price_per_hour=55,
            features="Covered,Shopping Center,Security"
        ),
        models.ParkingSpace(
            name="Railways Parking",
            address="Haile Selassie Avenue, Nairobi",
            latitude=-1.2876,
            longitude=36.8291,
            total_spots=25,
            available_spots=20,
            price_per_hour=45,
            features="Open Air,24/7,Budget Friendly"
        )
    ]
    
    for spot in spots:
        db.add(spot)

    db.commit()
    print("Seed data added successfully with demo users and parking spots.")
else:
    print("Demo users already exist.")
