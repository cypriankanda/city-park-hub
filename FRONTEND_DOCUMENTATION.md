
# ParkSmart Frontend Documentation

## Project Overview
ParkSmart is a React-based parking management system built with Vite, TypeScript, and Tailwind CSS. It uses a red, navy blue, and white color palette and provides both user and admin interfaces for parking management.

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query) for server state
- **HTTP Client**: Will need Axios for API calls
- **Icons**: Lucide React
- **UI Components**: Shadcn/ui components

## Color Palette
```css
--parking-navy: #1e3a8a (blue-800)
--parking-red: #dc2626 (red-600)
--white: #ffffff
```

## Routes & Pages

### Public Routes
1. **`/` - Landing Page (Index)**
   - File: `src/pages/Index.tsx`
   - Components: `Navigation.tsx`, `LandingPage.tsx`
   - Description: Marketing landing page with hero section, features, and authentication links

2. **`/login` - Login Page**
   - File: `src/pages/Login.tsx`
   - Description: User authentication form
   - Form Fields:
     - Email (email, required)
     - Password (password, required)
     - Remember me (checkbox)
   - Links to: `/register`, `/reset-password`

3. **`/register` - Registration Page**
   - File: `src/pages/Register.tsx`
   - Description: User registration form
   - Form Fields:
     - Full Name (text, required)
     - Email (email, required)
     - Phone Number (tel, required, format: +254 700 000 000)
     - Password (password, required)
     - Confirm Password (password, required)
     - Terms acceptance (checkbox, required)
   - Links to: `/login`

4. **`/reset-password` - Password Reset**
   - File: `src/pages/ResetPassword.tsx`
   - Description: Two-step password reset flow
   - Step 1: Email input for reset instructions
   - Step 2: Success confirmation message
   - Links to: `/login`

### Protected Routes (Require JWT Authentication)
5. **`/dashboard` - User Dashboard**
   - File: `src/pages/Dashboard.tsx`
   - Description: Main user interface with overview and quick actions
   - Features:
     - Welcome message with user name
     - Quick action cards (Find Parking, Quick Book)
     - Statistics grid (Total Bookings, Money Saved, Hours Saved, Favorite Spots)
     - Recent bookings list

6. **`/bookings` - Booking Management**
   - File: `src/pages/Bookings.tsx`
   - Description: View and manage parking bookings
   - Features:
     - Search and filter functionality
     - Tabbed interface (All, Active, Upcoming, Completed)
     - Booking cards with details and actions
     - Status-based actions (Modify, Cancel, Extend, Rebook)

7. **`/parking` - Parking Search & Availability**
   - File: `src/pages/Parking.tsx`
   - Description: Search and book available parking spots
   - Features:
     - Real-time parking spot availability
     - Location-based search
     - Filter options (availability, covered, security, price)
     - Parking spot cards with booking functionality

8. **`/admin` - Admin Panel**
   - File: `src/pages/Admin.tsx`
   - Description: Administrative interface for system management
   - Features:
     - Admin statistics dashboard
     - Location management
     - User management (placeholder)
     - System settings (placeholder)
     - Recent activities feed

### Error Routes
9. **`/*` - 404 Not Found**
   - File: `src/pages/NotFound.tsx`
   - Description: Catch-all route for non-existent pages

## Expected API Endpoints

### Authentication Endpoints
```
POST /api/auth/login
Body: { email: string, password: string, remember_me?: boolean }
Response: { token: string, user: User, expires_in: number }

POST /api/auth/register
Body: { 
  full_name: string, 
  email: string, 
  phone: string, 
  password: string,
  confirm_password: string 
}
Response: { token: string, user: User, message: string }

POST /api/auth/reset-password
Body: { email: string }
Response: { message: string, success: boolean }

POST /api/auth/verify-reset
Body: { token: string, new_password: string }
Response: { message: string, success: boolean }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user: User }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { message: string }
```

### User Dashboard Endpoints
```
GET /api/dashboard/stats
Headers: Authorization: Bearer <token>
Response: {
  total_bookings: number,
  money_saved: number,
  hours_saved: number,
  favorite_spots: number
}

GET /api/dashboard/recent-bookings
Headers: Authorization: Bearer <token>
Response: { bookings: Booking[] }
```

### Bookings Endpoints
```
GET /api/bookings
Headers: Authorization: Bearer <token>
Query: ?status=all|active|upcoming|completed&search=string
Response: { bookings: Booking[] }

POST /api/bookings
Headers: Authorization: Bearer <token>
Body: { 
  parking_spot_id: number,
  start_time: string,
  end_time: string,
  duration_hours: number
}
Response: { booking: Booking, payment_url?: string }

PUT /api/bookings/:id
Headers: Authorization: Bearer <token>
Body: { start_time?: string, end_time?: string }
Response: { booking: Booking }

DELETE /api/bookings/:id
Headers: Authorization: Bearer <token>
Response: { message: string }

POST /api/bookings/:id/extend
Headers: Authorization: Bearer <token>
Body: { additional_hours: number }
Response: { booking: Booking, additional_cost: number }
```

### Parking Endpoints
```
GET /api/parking/spots
Query: ?lat=number&lng=number&radius=number&search=string&filter=available|covered|security
Response: { spots: ParkingSpot[] }

GET /api/parking/spots/:id
Response: { spot: ParkingSpot }

POST /api/parking/spots/:id/book
Headers: Authorization: Bearer <token>
Body: { start_time: string, duration_hours: number }
Response: { booking: Booking }
```

### Admin Endpoints
```
GET /api/admin/stats
Headers: Authorization: Bearer <token>
Response: {
  total_users: number,
  active_bookings: number,
  revenue_today: number,
  total_parking_spots: number
}

GET /api/admin/activities
Headers: Authorization: Bearer <token>
Response: { activities: AdminActivity[] }

GET /api/admin/locations
Headers: Authorization: Bearer <token>
Response: { locations: ParkingLocation[] }

POST /api/admin/locations
Headers: Authorization: Bearer <token>
Body: { name: string, address: string, total_spots: number, price_per_hour: number }
Response: { location: ParkingLocation }

PUT /api/admin/locations/:id
Headers: Authorization: Bearer <token>
Body: { name?: string, address?: string, total_spots?: number, price_per_hour?: number }
Response: { location: ParkingLocation }
```

## Data Models

### User
```typescript
interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  role: 'user' | 'admin';
}
```

### Booking
```typescript
interface Booking {
  id: number;
  user_id: number;
  parking_spot_id: number;
  location: string;
  address: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM - HH:MM
  duration: string; // "X hours"
  price: string; // "KSh XXX"
  status: 'active' | 'completed' | 'upcoming' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
}
```

### ParkingSpot
```typescript
interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: string; // "X.X km"
  available_spots: number;
  total_spots: number;
  price_per_hour: number;
  rating: number;
  features: string[]; // ["Covered", "Security", "24/7", "EV Charging", "Valet"]
  walk_time: string; // "X min"
  created_at: string;
  updated_at: string;
}
```

### ParkingLocation (Admin)
```typescript
interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  total_spots: number;
  occupied_spots: number;
  revenue_today: number;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

### AdminActivity
```typescript
interface AdminActivity {
  id: number;
  action: string;
  user?: string;
  location?: string;
  amount?: string;
  time: string;
  type: 'user' | 'spot' | 'payment' | 'booking' | 'alert';
}
```

## Authentication Flow
1. User logs in via `/login` with email/password
2. Backend returns JWT token and user data
3. Frontend stores token (localStorage/sessionStorage based on "remember me")
4. All protected routes check for valid token
5. Token included in Authorization header: `Bearer <token>`
6. If token expires, redirect to login page

## Error Handling
- Network errors: Show toast notifications
- 401 Unauthorized: Redirect to login
- 403 Forbidden: Show access denied message
- 404 Not Found: Show custom 404 page
- Validation errors: Show field-specific error messages

## State Management
- Server state managed by TanStack Query
- Local component state with React useState
- Form state handled by individual components
- Authentication state in context or query

## Responsive Design
- Mobile-first approach with Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- All components are fully responsive
- Touch-friendly interface on mobile devices

## Payment Integration
- Frontend expects payment URLs from booking endpoints
- Uses Kenyan Shilling (KSh) currency format
- Supports M-Pesa and Card payment methods
- Payment confirmation handled via callback URLs

## Real-time Features
- Parking availability updates (WebSocket or polling)
- Booking status changes
- Admin activity feed
- Location occupancy updates

## Security Considerations
- JWT tokens with expiration
- HTTPS only for production
- Input validation on all forms
- XSS protection via React's built-in escaping
- CSRF protection via SameSite cookies

## Deployment
- Built for static hosting (Vercel, Netlify)
- Environment variables for API base URL
- Build command: `npm run build`
- Output directory: `dist/`
