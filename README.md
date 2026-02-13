# Sessions Marketplace

A full-stack web application for booking and managing educational sessions. Users can browse and book sessions, while creators can create and manage their own sessions.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Context** - State management

### Backend
- **Django 5** - Web framework
- **Django REST Framework** - API development
- **Simple JWT** - Token authentication
- **PostgreSQL** - Database

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy

## Features

### Authentication
- Email/password registration and login
- JWT token-based authentication with auto-refresh
- Role-based access (User / Creator)
- Protected routes with AuthGuard

### Sessions
- Browse published sessions catalog
- Session detail page with creator info
- Creators can create, edit, and delete sessions
- Session status management (draft, published, cancelled)
- Capacity tracking with real-time availability

### Bookings
- Book sessions with date/time selection
- Simulated payment flow with confirmation
- Capacity validation (prevents overbooking)
- One booking per user per session (unique constraint)
- Cancel bookings (removes booking record)

### Dashboards
- **User Dashboard**: View and manage bookings
- **Creator Dashboard**: Manage sessions, view bookings from users

### Profile
- View and update profile information
- Avatar support (URL-based)

## Project Structure

```
sessions-marketplace/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   ├── register/
│       │   │   └── callback/
│       │   ├── (protected)/
│       │   │   ├── dashboard/
│       │   │   ├── creator-dashboard/
│       │   │   └── profile/
│       │   ├── sessions/
│       │   │   └── [id]/
│       │   └── page.js
│       ├── components/
│       │   └── Navbar.js
│       ├── context/
│       │   └── AuthContext.js
│       └── lib/
│           ├── api.js
│           └── auth.js
├── backend/
│   ├── config/
│   ├── users/
│   ├── session_catalog/
│   └── bookings/
├── nginx/
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Docker Desktop
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd sessions-marketplace

# Start all services
docker-compose up --build

# Create admin user (in another terminal)
docker-compose exec backend python manage.py createsuperuser
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| Admin Panel | http://localhost:8000/admin |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login and get tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/profile/` | Get current user profile |
| PATCH | `/api/auth/profile/` | Update profile |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions/` | List published sessions |
| GET | `/api/sessions/?my_sessions=true` | List creator's own sessions |
| POST | `/api/sessions/` | Create session (creator only) |
| GET | `/api/sessions/{id}/` | Get session details |
| PUT | `/api/sessions/{id}/` | Update session (creator only) |
| DELETE | `/api/sessions/{id}/` | Delete session (creator only) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/` | List user's bookings |
| POST | `/api/bookings/` | Create booking |
| PATCH | `/api/bookings/{id}/` | Update/Cancel booking |
| DELETE | `/api/bookings/{id}/` | Delete booking |
| GET | `/api/bookings/my_bookings/` | Get user's bookings |
| GET | `/api/bookings/creator_bookings/` | Get bookings for creator's sessions |

## Data Models

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | string | Unique, used for login |
| username | string | Display name |
| role | string | USER or CREATOR |
| avatar | URL | Profile picture |
| first_name | string | First name |
| last_name | string | Last name |

### Session
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| creator | FK(User) | Session creator |
| title | string | Session title |
| description | text | Session description |
| price | decimal | Price in dollars |
| duration_minutes | integer | Duration in minutes |
| capacity | integer | Maximum participants |
| current_bookings | integer | Current booking count |
| status | string | draft, published, cancelled |
| image | URL | Session image |
| start_time | datetime | Session start time |

### Booking
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user | FK(User) | Booking user |
| session | FK(Session) | Booked session |
| booking_date | datetime | Scheduled date |
| amount | decimal | Amount paid |
| status | string | pending, confirmed, cancelled |
| payment_status | string | unpaid, paid, refunded |

## Environment Variables

```env
# Database
POSTGRES_DB=sessionsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Common Commands

```bash
# Start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Create migrations
docker-compose exec backend python manage.py makemigrations

# Access Django shell
docker-compose exec backend python manage.py shell

# Access database
docker-compose exec db psql -U postgres -d sessionsdb

# Restart a service
docker-compose restart backend
```

## Development

### Backend (Local)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Local)
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Database connection issues
```bash
# Check if database is running
docker-compose ps

# Reset database
docker-compose down -v
docker-compose up --build
```

### Frontend not updating
```bash
# Rebuild frontend
docker-compose up -d --build frontend
```

## License

MIT
