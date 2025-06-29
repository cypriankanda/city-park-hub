import requests
import json
import time

def test_endpoint(url, method, data=None):
    print(f"\nTesting {url}...")
    headers = {"Content-Type": "application/json"}
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except json.JSONDecodeError:
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Error: {str(e)}")

# Wait for server to start
time.sleep(2)

# Test endpoints
base_url = "http://127.0.0.1:8000"

# 1. Test Register
register_data = {
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirm_password": "password123"
}
test_endpoint(f"{base_url}/api/auth/register", "POST", register_data)

# 2. Test Login
login_data = {
    "email": "test@example.com",
    "password": "password123"
}
test_endpoint(f"{base_url}/api/auth/login", "POST", login_data)

# 3. Test List Parking Spots
test_endpoint(f"{base_url}/api/parking/spots", "GET")

# 4. Test Get Parking Spot
spot_id = 1  # Adjust based on actual data
test_endpoint(f"{base_url}/api/parking/spots/{spot_id}", "GET")

# 5. Test Book Spot
book_data = {
    "start_time": "2025-06-30T10:00:00",
    "duration_hours": 2
}
test_endpoint(f"{base_url}/api/parking/spots/{spot_id}/book", "POST", book_data)

# 6. Test Create Booking
booking_data = {
    "parking_space_id": spot_id,
    "start_time": "2025-06-30T10:00:00",
    "end_time": "2025-06-30T12:00:00",
    "duration_hours": 2
}
test_endpoint(f"{base_url}/api/bookings", "POST", booking_data)

# 7. Test List Bookings
test_endpoint(f"{base_url}/api/bookings", "GET")

# 8. Test Extend Booking
booking_id = 1  # Adjust based on actual data
extend_data = {
    "additional_hours": 1
}
test_endpoint(f"{base_url}/api/bookings/{booking_id}/extend", "POST", extend_data)
