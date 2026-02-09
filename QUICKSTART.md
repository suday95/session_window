# 🚀 QUICK START GUIDE

## ⏱️ 30 Second Setup

```bash
# 1. Navigate to project
cd sessions-marketplace

# 2. Start all services
docker-compose up --build

# 3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
```

## ✨ What's Ready

### ✅ Backend (Django REST Framework)
- Custom User model with roles (user/creator)
- Session management (create, list, detail)
- Booking system
- JWT authentication
- PostgreSQL database
- CORS enabled
- Admin panel configured

### ✅ API Endpoints (8 core endpoints)
```
POST   /api/auth/register/           - Register
POST   /api/auth/login/              - Login & get tokens
GET    /api/auth/profile/            - Get profile
PUT    /api/auth/profile/            - Update profile

GET    /api/sessions/                - List sessions
POST   /api/sessions/                - Create session
GET    /api/sessions/{id}/           - Session details
PUT    /api/sessions/{id}/           - Update session
DELETE /api/sessions/{id}/           - Delete session

GET    /api/bookings/                - List bookings
POST   /api/bookings/                - Create booking
GET    /api/bookings/my_bookings/    - My bookings
GET    /api/bookings/creator_bookings/ - Creator's bookings
```

### ✅ Docker Setup
- PostgreSQL (port 5432)
- Django backend (port 8000)
- Node.js frontend (port 3000)
- Nginx reverse proxy (port 80)

### ✅ Database
- Pre-configured PostgreSQL
- Auto-migrations on startup
- Admin access ready

## 🔐 Default Credentials

```
Database: 
  - User: postgres
  - Password: postgres123
  - Database: sessionsdb
```

## 📝 Create Admin User

Once Docker is running:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Then access admin at: `http://localhost:8000/admin`

## 📁 Project Structure

```
sessions-marketplace/
├── backend/              # Django REST API
│   ├── users/           # User management
│   ├── sessions/        # Session CRUD
│   ├── bookings/        # Booking management
│   └── config/          # Django settings
├── frontend/            # React/Next.js (ready for dev)
├── nginx/               # Reverse proxy config
├── docker-compose.yml   # Multi-container setup
└── README.md           # Full documentation
```

## 🔧 Development Tips

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Reset Database
```bash
docker-compose down -v  # Remove volumes
docker-compose up --build
```

### Access Django Shell
```bash
docker-compose exec backend python manage.py shell
```

## 📚 API Testing

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"pass123","role":"user"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# List Sessions
curl http://localhost:8000/api/sessions/
```

### Using Postman
1. Import the endpoints from API documentation
2. Set up JWT authentication
3. Test each endpoint

## 🎯 Next Steps (Frontend Development)

The backend is 100% ready. Frontend development includes:

1. **Pages to Create:**
   - Login/Register
   - Home/Catalog
   - Session Details + Booking
   - User Dashboard
   - Creator Dashboard

2. **Features to Implement:**
   - User authentication flow
   - Session listing and search
   - Booking functionality
   - Dashboard analytics

3. **Styling:**
   - Tailwind CSS setup
   - Responsive design
   - Dark mode (optional)

## ⚠️ Important Notes

- All code follows Django/REST best practices
- CORS is enabled for development (configure in production)
- JWT tokens expire after 1 day
- Refresh tokens expire after 7 days
- Database runs inside Docker container
- All migrations run automatically

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
# Or stop the service using the port
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check if db service is healthy
docker-compose ps
# Rebuild if needed
docker-compose down -v
docker-compose up --build
```

### Migrations Failed
```bash
docker-compose exec backend python manage.py migrate --run-syncdb
```

## 📞 Support

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- PostgreSQL: https://www.postgresql.org/docs/

---

**Everything is ready! Start with:** `docker-compose up --build`
