# Sessions Marketplace

A full-stack application for managing and marketplace sessions with Django backend, Next.js frontend, and Nginx reverse proxy.

## Project Structure

```
sessions-marketplace/
├── backend/           # Django REST API
├── frontend/          # Next.js application
├── nginx/             # Nginx configuration & reverse proxy
├── docker-compose.yml # Multi-container orchestration
└── .env.example       # Environment variables template
```

## Technologies

- **Backend**: Django 5.2, Django REST Framework, PostgreSQL
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Proxy**: Nginx
- **Database**: PostgreSQL
- **Container**: Docker & Docker Compose
- **Auth**: JWT with djangorestframework-simplejwt

## Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone or navigate to project
cd sessions-marketplace

# Copy environment file
cp .env.example .env

# Build and start all services
docker-compose up --build

# Access the application
- Frontend: http://localhost (or http://localhost:3000 directly)
- Backend API: http://localhost/api (or http://localhost:8000 directly)
- Admin Panel: http://localhost:8000/admin
```

### Option 2: Local Development

**Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file from .env.example
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Refresh token

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create user
- `GET /api/users/<id>/` - Get user detail
- `PUT /api/users/<id>/` - Update user
- `DELETE /api/users/<id>/` - Delete user

## Environment Variables

See `.env.example` for all available configuration options.

## Development

### Backend
- Django admin: `http://localhost:8000/admin`
- API documentation: Add DRF spectacular for Swagger/Redoc
- Run migrations: `python manage.py migrate`
- Create app: `python manage.py startapp <app_name>`

### Frontend
- Development server automatically reloads on changes
- Build for production: `npm run build`
- Start production: `npm start`

## Database

PostgreSQL is used. Database credentials:
- Database: `sessionsdb`
- User: `postgres`
- Password: `postgres123`
- Host: `db` (in Docker) or `localhost` (local development)
- Port: `5432`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `GET /api/auth/profile/` - Get current user profile
- `PUT /api/auth/profile/` - Update user profile

### Sessions
- `GET /api/sessions/` - List all active sessions
- `POST /api/sessions/` - Create new session (creator only)
- `GET /api/sessions/{id}/` - Get session details
- `PUT /api/sessions/{id}/` - Update session (creator only)
- `DELETE /api/sessions/{id}/` - Delete session (creator only)

### Bookings
- `GET /api/bookings/` - List user's bookings
- `POST /api/bookings/` - Create new booking
- `GET /api/bookings/my_bookings/` - Get user's bookings
- `GET /api/bookings/creator_bookings/` - Get creator's bookings (creator only)

## Database Setup (Local Development)

To create a superuser for Django admin:

```bash
cd backend
python manage.py createsuperuser
```

Then access admin at: `http://localhost:8000/admin`

## Deployment

1. Update `SECRET_KEY` in settings
2. Set `DEBUG=False` in production
3. Update `ALLOWED_HOSTS` in Django settings
4. Use environment-specific configuration
5. Set up proper SSL/TLS certificates
6. Use strong database credentials

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/name`
5. Create Pull Request

## License

MIT
