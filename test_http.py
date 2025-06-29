import http.client
import json
import sys

try:
    # Create connection
    print("Connecting to server...")
    conn = http.client.HTTPConnection("localhost", 8000)
    
    # Prepare request
    headers = {"Content-Type": "application/json"}
    data = {
        "full_name": "Test User",
        "email": "test@example.com",
        "phone": "1234567890",
        "password": "password123",
        "confirm_password": "password123"
    }
    
    # Send request
    print("Sending request...")
    conn.request("POST", "/api/auth/register", json.dumps(data), headers)
    
    # Get response
    print("Getting response...")
    response = conn.getresponse()
    print(f"Status Code: {response.status}")
    print(f"Response: {response.read().decode()}")
    
except http.client.HTTPException as e:
    print(f"HTTP Error: {str(e)}")
except ConnectionRefusedError:
    print("Error: Connection refused. Is the server running?")
except Exception as e:
    print(f"Unexpected error: {str(e)}")
finally:
    if 'conn' in locals():
        conn.close()
