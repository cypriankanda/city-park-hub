from backend import models, auth
from backend.database import SessionLocal, engine



models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Only seed if not already present
if not db.query(models.Driver).filter_by(email="admin@parksmart.com").first():
    admin = models.Driver(
        full_name="Admin User",
        email="admin@parksmart.com",
        phone="+254700000000",
        hashed_password=auth.get_password_hash("password123"),
        role="admin"
    )
    db.add(admin)

    spot = models.ParkingSpace(
        name="Kenyatta Ave Parking",
        address="Kenyatta Avenue, Nairobi",
        latitude=-1.2921,
        longitude=36.8219,
        total_spots=20,
        available_spots=20,
        price_per_hour=50,
        features="Covered,Security,24/7"
    )
    db.add(spot)

    db.commit()
    print("Seed data added.")
else:
    print("Admin already exists.")
