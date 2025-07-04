🚗 City Park Hub
A modern, full-stack parking management system that streamlines urban parking operations for both users and administrators.

Project Owner: Cyprian Kanda

🌟 Features

Core Features
User Authentication
- Secure login and registration
- Password reset functionality
- JWT-based authentication
Parking Management
- Real-time parking spot availability
- Location-based search with radius filtering
- Advanced filtering options
Booking System
- Real-time booking with instant confirmation
- Booking extension capability
- Booking cancellation
User Dashboard
- Personalized dashboard with booking history
- Quick access to recent bookings
- Booking status tracking
Admin Features
- Parking location management
- Revenue tracking
- Activity monitoring
- Location analytics

📸 Screenshots
(Add screenshots of the application here)

🛠️ Tech Stack
Frontend (React SPA)
- React 18 + TypeScript
- React Router for routing
- Tailwind CSS for styling
- Axios for API calls
- Redux Toolkit for state management
Backend (FastAPI)
- FastAPI framework
- SQLAlchemy ORM
- PostgreSQL database
- JWT authentication
- CORS support

🚀 Getting Started

Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)
- PostgreSQL (14 or higher)
- npm or yarn

📱 App Routes
Public Routes
/ - Landing Page
/login - User Login
/register - Registration
/forgot-password - Password Reset
Protected Routes
/dashboard - User Dashboard
/bookings - Booking Management
/parking - Parking Locations
/history - Booking History
/admin - Admin Dashboard

🔧 API Endpoints
Public Endpoints
POST /api/auth/register - User Registration
POST /api/auth/login - User Login
POST /api/auth/reset-password - Password Reset
Protected Endpoints
GET /api/dashboard - User Dashboard
POST /api/bookings - Create Booking
PUT /api/bookings/:id - Update Booking
DELETE /api/bookings/:id - Cancel Booking
GET /api/parking - Parking Locations
POST /api/parking - Create Location (Admin)

🔧 Database Schema
Models
User
- id, email, password_hash, full_name, phone, role, created_at, updated_at
Booking
- id, driver_id, parking_space_id, start_time, end_time, duration_hours, status, payment_method, created_at, updated_at
ParkingSpot
- id, name, address, latitude, longitude, available_spots, total_spots, price_per_hour, features, rating, created_at, updated_at
AdminActivity
- id, action, user, location, amount, time, type

📂 Project Structure
City-Park-Hub/
├── frontend/    # React frontend
│   ├── public/                 # Static files
│   ├── src/                    # Source files
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services
│   │   └── store/              # Redux store
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
│
└── backend/    # FastAPI backend
    ├── app/                     # Application package
    │   ├── models/             # Database models
    │   ├── routes/             # API endpoints
    │   ├── schemas/            # Pydantic schemas
    │   ├── services/           # Business logic
    │   ├── auth/               # Authentication
    │   ├── database/           # Database configuration
    │   ├── __init__.py         # App factory
    │   └── config.py           # Configuration
    ├── migrations/             # Database migrations
    ├── tests/                  # Backend tests
    ├── requirements.txt        # Python dependencies
    └── Procfile                # Render deployment configuration

👥 User Stories
As a user, I want to:
- Register and login securely
- View available parking spots near me
- Book parking spots instantly
- Extend my booking duration
- Track my booking history
- Receive booking notifications

As an admin, I want to:
- Manage parking locations
- Monitor revenue and usage
- Track user activities
- Generate reports

🤝 Contributing
We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📧 Contact
Cyprian Kanda - @github
Project Link: [https://github.com/cypriankanda/city-park-hub]

🧑‍💼 Admin Dashboard

🚘 Vehicle Management

💳 Payment Integration

📱 Mobile-Responsive UI

🔔 Live Booking Status Updates

🧰 Tech Stack
Category	Technology
Frontend	React + TypeScript
UI Components	Shadcn UI
State Management	React Context API
API Handling	React Query
Authentication	JWT
Routing	React Router
Forms	React Hook Form
Styling	Tailwind CSS
Icons	Lucide React

🚀 Getting Started
Prerequisites
Node.js v16+ and npm

A backend API server (with JWT authentication)

Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/cypriankanda/city-park-hub.git

# Navigate to the project folder
cd city-park-hub

# Install dependencies
npm install

# Start the development server
npm run dev
🔐 Environment Variables
Create a .env file in the root directory and add:

env
Copy
Edit
VITE_API_BASE_URL=https://your-api-url.com
🗂️ Project Structure
bash
Copy
Edit
src/
├── components/          # Reusable UI elements
│   ├── ui/              # Shadcn UI components
│   └── common/          # Shared layout and widgets
├── context/             # React Context Providers
│   └── AuthContext.tsx
├── lib/                 # Utility functions
│   └── auth.ts
├── pages/               # Page-level components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Bookings.tsx
│   ├── Parking.tsx
│   └── Admin.tsx
├── types/               # TypeScript type definitions
📜 Available Scripts
bash
Copy
Edit
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint the codebase
npm run lint
🤝 Contributing
Fork the repository

Create a feature branch: git checkout -b feature/YourFeature

Commit your changes: git commit -m "Add YourFeature"

Push to your branch: git push origin feature/YourFeature

Open a Pull Request

📄 License
This project is licensed under the MIT License.

🛟 Support
If you encounter issues or have feature requests, please open an issue in the repository.