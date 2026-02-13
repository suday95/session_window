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
- **MinIO** - S3-compatible object storage for image uploads

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
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd sessions-marketplace
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development):

```env
# Database
POSTGRES_DB=sessionsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
SECRET_KEY=django-insecure-CHANGE-THIS-IN-PRODUCTION
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 3: Start the Application

```bash
# Build and start all containers
docker-compose up --build
```

Wait for all services to start (first run takes 2-3 minutes).

### Step 4: Initialize MinIO Storage

Set up the storage bucket for session images:

```bash
# Create MinIO bucket and set public access
docker-compose exec minio mc alias set local http://localhost:9000 minioadmin minioadmin123
docker-compose exec minio mc mb local/sessions-media --ignore-existing
docker-compose exec minio mc anonymous set public local/sessions-media
```

### Step 5: Create Admin User

Open a new terminal:

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 6: Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| Admin Panel | http://localhost:8000/admin |
| MinIO Console | http://localhost:9001 |

---

## Google OAuth Setup (Optional)

OAuth is optional. The app works with email/password authentication by default.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" > "New Project"
3. Name it "Sessions Marketplace" and create

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select "External" and click "Create"
3. Fill in:
   - App name: `Sessions Marketplace`
   - User support email: your email
   - Developer contact: your email
4. Click "Save and Continue" through remaining steps

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Name: `Sessions Marketplace Web`
5. Add Authorized redirect URI:
   ```
   http://localhost:8000/accounts/google/login/callback/
   ```
6. Click "Create" and copy your **Client ID** and **Client Secret**

### Step 4: Add to Django Admin

1. Go to http://localhost:8000/admin
2. Login with your superuser account

   If you haven't created a superuser yet, create one with:
   ```bash
   # Interactive (prompts for input)
   docker-compose exec backend python manage.py createsuperuser

   # Non-interactive (set credentials directly)
   docker-compose exec backend python manage.py shell -c "
   from users.models import User
   User.objects.create_superuser(
       email='admin@example.com',
       username='admin',
       password='admin123',
       name='Admin'
   )
   print('Superuser created!')
   "
   ```

3. Navigate to **Social applications** > **Add social application**
4. Fill in:
   - Provider: `Google`
   - Name: `Google`
   - Client id: (paste your Client ID)
   - Secret key: (paste your Client Secret)
   - Sites: Move `example.com` to "Chosen sites"
5. Click "Save"

Google login is now available on the login page.

---

## Demo Flow

### Scenario: Complete User Journey

This walkthrough demonstrates the main features of the application.

#### Part 1: Register as a Creator

1. Open http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Click "Create an account"
4. Fill in the registration form:
   - Username: `johncreator`
   - Email: `creator@example.com`
   - Password: `Test123!`
   - Account Type: Select "Creator"
5. Click "Create Account"
6. Login with your new credentials

#### Part 2: Create a Session (as Creator)

1. After login, click "My Sessions" in the navbar
2. You'll see the Creator Dashboard
3. Click "Create New Session"
4. Fill in session details:
   - Title: `Introduction to Python`
   - Description: `Learn Python basics in this hands-on session`
   - Price: `49.99`
   - Duration: `60` minutes
   - Capacity: `10`
   - Status: `Published`
5. Click "Create Session"
6. Your session appears in "My Sessions"

#### Part 3: Register as a User

1. Click "Logout"
2. Click "Get Started"
3. Register a new account:
   - Username: `janeuser`
   - Email: `user@example.com`
   - Password: `Test123!`
   - Account Type: Select "User"
4. Login with these credentials

#### Part 4: Browse and Book a Session (as User)

1. Go to the home page (click "Sessions" logo)
2. Browse available sessions
3. Click on "Introduction to Python"
4. View session details:
   - Price, duration, capacity
   - Creator information
   - Available spots
5. Select a date and time for your booking
6. Click "Book Now"
7. Complete the simulated payment:
   - Card details are pre-filled (test mode)
   - Click "Pay $49.99"
8. See payment success confirmation
9. Redirected to your dashboard

#### Part 5: View Booking (as User)

1. Click "My Bookings" in the navbar
2. See your confirmed booking
3. View booking details:
   - Session information
   - Scheduled date
   - Payment status
4. Option to cancel booking if needed

#### Part 6: View Booking (as Creator)

1. Logout and login as `creator@example.com`
2. Go to "My Sessions" (Creator Dashboard)
3. See "Recent Bookings" section
4. View who booked your session:
   - User information
   - Booking date
   - Payment amount

### Quick Test Commands

Create test data via Django shell:

```bash
docker-compose exec backend python manage.py shell
```

```python
from users.models import User
from session_catalog.models import Session

# Create a creator
creator = User.objects.create_user(
    email='creator@test.com',
    username='testcreator',
    password='test123',
    role='CREATOR'
)

# Create a session
Session.objects.create(
    creator=creator,
    title='Test Session',
    description='A test session for demo',
    price=29.99,
    duration_minutes=45,
    capacity=5,
    status='published'
)

print('Test data created!')
exit()
```

---

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

---

## Bonus: Rate Limiting / Throttling

API rate limiting is implemented to prevent abuse and protect against brute-force attacks.

### Implementation

| Endpoint | Rate Limit | Purpose |
|----------|------------|---------|
| Login | 5 requests/minute | Prevents brute-force password attacks |
| Register | 5 requests/hour | Prevents mass account creation |
| General (authenticated) | 1000/hour | Normal API usage |
| General (anonymous) | 100/hour | Public browsing |

### How It Works

Rate limiting is per IP address. Each IP has its own quota:
- User A (IP: 1.2.3.4) → 5 login attempts/min
- User B (IP: 5.6.7.8) → 5 login attempts/min

When limit is exceeded, API returns:
```json
{
  "detail": "Request was throttled. Expected available in 45 seconds."
}
```

### Code Implementation

**settings.py** - Global defaults:
```python
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "1000/hour",
        "anon": "100/hour",
    }
}
```

**users/views.py** - Custom throttles for sensitive endpoints:
```python
class LoginThrottle(UserRateThrottle):
    rate = "5/min"

class RegisterThrottle(UserRateThrottle):
    rate = "5/hour"

class LoginView(generics.GenericAPIView):
    throttle_classes = [LoginThrottle]
    # ...

class RegisterView(generics.CreateAPIView):
    throttle_classes = [RegisterThrottle]
    # ...
```

### Testing Throttle

Run this command to test login throttling (makes 7 rapid requests):

```bash
for i in {1..7}; do
  echo "Request $i:"
  curl -s -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' | head -c 100
  echo ""
done
```

**Expected result:**
- Requests 1-5: Normal response (invalid credentials)
- Requests 6-7: `"Request was throttled..."`

### Screenshot

![Throttling Demo](docs/images/throttling-demo.png)

*After 5 login attempts, the API blocks further requests for that IP.*

---

## Bonus: MinIO File Storage

Session images are stored using MinIO, an S3-compatible object storage service. This allows creators to upload images directly rather than relying on external URLs.

### Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│    MinIO    │
│  (Upload)   │      │  (Django)   │      │  (Storage)  │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                     django-storages
                        + boto3
```

### Features

| Feature | Description |
|---------|-------------|
| **Dual Input** | Creators can upload files OR paste external URLs |
| **S3 Compatible** | Uses standard S3 API via django-storages |
| **Public Access** | Images are publicly accessible (no signed URLs) |
| **File Validation** | Frontend validates type (images only) and size (max 5MB) |

### Configuration

**docker-compose.yml** - MinIO service:
```yaml
minio:
  image: minio/minio
  ports:
    - "9000:9000"   # S3 API
    - "9001:9001"   # Web Console
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin123
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
```

**settings.py** - Django storage config:
```python
# MinIO/S3 Settings
DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

AWS_ACCESS_KEY_ID = "minioadmin"
AWS_SECRET_ACCESS_KEY = "minioadmin123"
AWS_STORAGE_BUCKET_NAME = "sessions-media"
AWS_S3_ENDPOINT_URL = "http://minio:9000"  # Internal Docker URL
AWS_QUERYSTRING_AUTH = False  # Public access without signed URLs
```

**Session model** - ImageField:
```python
class Session(models.Model):
    image = models.ImageField(upload_to='sessions/', blank=True, null=True)
    image_url_external = models.URLField(blank=True, null=True)  # Alternative: external URL
```

**Serializer** - Returns correct public URL:
```python
def get_image_url(self, obj):
    if obj.image:
        url = obj.image.url
        # Convert internal Docker URL to public localhost URL
        if 'minio:9000' in url:
            url = url.replace('http://minio:9000', 'http://localhost:9000')
        return url
    return obj.image_url_external  # Fallback to external URL
```

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| MinIO API | http://localhost:9000 | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |
| Uploaded Images | http://localhost:9000/sessions-media/... | Public |

### Setup Commands

After starting containers, create the bucket:

```bash
# Create MinIO bucket
docker-compose exec minio mc alias set local http://localhost:9000 minioadmin minioadmin123
docker-compose exec minio mc mb local/sessions-media --ignore-existing

# Set bucket to public
docker-compose exec minio mc anonymous set public local/sessions-media
```

### Testing Image Upload

1. Login as a Creator at http://localhost:3000/login
2. Go to Creator Dashboard → Create New Session
3. Choose image input method:
   - **🔗 Image URL**: Paste any external image URL
   - **📤 Upload File**: Select an image from your computer
4. Create the session
5. View the session on the homepage - image should display

### Verify Upload via API

```bash
# List sessions and check image_url field
curl -s http://localhost:8000/api/sessions/ | python3 -m json.tool | grep "image_url"

# Expected output for uploaded image:
# "image_url": "http://localhost:9000/sessions-media/sessions/<uuid>/filename.jpg"
```

### View Files in MinIO Console

1. Open http://localhost:9001
2. Login: `minioadmin` / `minioadmin123`
3. Navigate to `sessions-media` bucket
4. Browse uploaded session images

### Dependencies

```
# backend/requirements.txt
django-storages==1.14.2
boto3==1.34.0
Pillow==10.2.0
```
