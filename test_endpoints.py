import requests
import json

# Base URL
base_url = "http://127.0.0.1:8000/api"

# 1. Test Register
print("\nTesting Register...")
register_data = {
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirm_password": "password123"
}
response = requests.post(f"{base_url}/auth/register", json=register_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 2. Test Login
print("\nTesting Login...")
login_data = {
    "email": "test@example.com",
    "password": "password123"
}
response = requests.post(f"{base_url}/auth/login", json=login_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 3. Test List Parking Spots
print("\nTesting List Parking Spots...")
response = requests.get(f"{base_url}/parking/spots")
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 4. Test Get Parking Spot
print("\nTesting Get Parking Spot...")
spot_id = 1  # This will need to be adjusted based on actual data
response = requests.get(f"{base_url}/parking/spots/{spot_id}")
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 5. Test Book Spot
print("\nTesting Book Spot...")
book_data = {
    "start_time": "2025-06-30T10:00:00",
    "duration_hours": 2
}
response = requests.post(f"{base_url}/parking/spots/{spot_id}/book", json=book_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 6. Test Create Booking
print("\nTesting Create Booking...")
booking_data = {
    "parking_space_id": spot_id,
    "start_time": "2025-06-30T10:00:00",
    "end_time": "2025-06-30T12:00:00",
    "duration_hours": 2
}
response = requests.post(f"{base_url}/bookings", json=booking_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 7. Test List Bookings
print("\nTesting List Bookings...")
response = requests.get(f"{base_url}/bookings")
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# 8. Test Extend Booking
print("\nTesting Extend Booking...")
booking_id = 1  # This will need to be adjusted based on actual data
extend_data = {
    "additional_hours": 1
}
response = requests.post(f"{base_url}/bookings/{booking_id}/extend", json=extend_data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
