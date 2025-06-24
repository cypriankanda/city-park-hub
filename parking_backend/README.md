# City Park Hub Backend

This is the backend service for the City Park Hub application, built with Flask.

## Prerequisites

- Python 3.8+
- PostgreSQL (for production)
- Node.js (for frontend)

## Local Development

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file with:
```
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///parking.db  # For development
```

4. Run migrations:
```bash
flask db init
flask db migrate
flask db upgrade
```

5. Start the server:
```bash
python run.py
```

## Production Deployment (Render)

1. Create a Render account at https://render.com

2. Connect your GitHub repository:
   - Go to Render dashboard
   - Click "New +" > "Web Service"
   - Connect your GitHub repository

3. Configure the service:
   - Service Type: Web Service
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run.py`
   - Environment Variables:
     ```
     FLASK_ENV=production
     SECRET_KEY=your-production-secret-key
     JWT_SECRET_KEY=your-production-jwt-secret-key
     DATABASE_URL=your-render-database-url
     ```

4. Set up PostgreSQL database:
   - In Render dashboard, click "New +" > "PostgreSQL Database"
   - Copy the database URL and add it to your environment variables

5. Deploy:
   - Click "Deploy" in the Render dashboard
   - Wait for the deployment to complete
   - Your application will be available at your Render URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/verify-reset-token` - Verify reset token
- `POST /api/auth/reset-password/complete` - Complete password reset

### Rate Limits
- Registration: 100/day; 10/hour
- Login: 200/day; 20/hour
- Password Reset: 50/day; 5/hour

## Security Features

- JWT-based authentication
- Password hashing
- Rate limiting
- Input validation
- Error logging
- Database connection pooling
- Secure environment variables

## Monitoring

The application includes:
- Request logging
- Error tracking
- Performance metrics
- Health checks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
