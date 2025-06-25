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

# Create API router
api_router = APIRouter(prefix="/api")

# Add auth routes
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

# Add dashboard routes
api_router.add_api_route("/dashboard/stats", get_stats, methods=["GET"])
api_router.add_api_route("/dashboard/recent-bookings", recent_bookings, methods=["GET"])

# Add bookings routes
api_router.add_api_route("/bookings", list_bookings, methods=["GET"])
api_router.add_api_route("/bookings", create_booking, methods=["POST"])
api_router.add_api_route("/bookings/{booking_id}", update_booking, methods=["PUT"])
api_router.add_api_route("/bookings/{booking_id}", delete_booking, methods=["DELETE"])
api_router.add_api_route("/bookings/{booking_id}/extend", extend_booking, methods=["POST"])

# Add parking routes
api_router.add_api_route("/parking/spots", list_parking_spots, methods=["GET"])
api_router.add_api_route("/parking/spots/{spot_id}", get_parking_spot, methods=["GET"])
api_router.add_api_route("/parking/spots/{spot_id}/book", book_spot, methods=["POST"])

# Add admin routes
api_router.add_api_route("/admin/stats", admin_stats, methods=["GET"])
api_router.add_api_route("/admin/activities", admin_activities, methods=["GET"])
api_router.add_api_route("/admin/locations", list_locations, methods=["GET"])
api_router.add_api_route("/admin/locations", create_location, methods=["POST"])
api_router.add_api_route("/admin/locations/{location_id}", update_location, methods=["PUT"])

app = FastAPI(title="City Park Hub API", version="1.0.0")
app.include_router(api_router)

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
