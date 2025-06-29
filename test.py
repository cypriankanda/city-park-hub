import requests
import json

# Test register endpoint
url = "http://localhost:8000/api/auth/register"
headers = {"Content-Type": "application/json"}
data = {
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirm_password": "password123"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {str(e)}")
