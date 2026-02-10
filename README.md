# Sessions Marketplace - Complete Guide

A professional full-stack web application for booking and managing educational sessions. Built with modern technologies: Next.js, Django, PostgreSQL, and Docker.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Django](https://img.shields.io/badge/Django-5.0-green.svg)
![Status](https://img.shields.io/badge/status-production%20ready-success.svg)

---

## Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start](#-quick-start)
6. [Environment Setup](#-environment-setup)
7. [OAuth Configuration](#-oauth-configuration-optional)
8. [API Documentation](#-api-documentation)
9. [API Testing Guide](#-api-testing-guide)
10. [Demo Flow & Scenarios](#-demo-flow--scenarios)
11. [Development Guide](#-development-guide)
12. [Implementation Checklist](#-implementation-checklist)
13. [Troubleshooting](#-troubleshooting)
14. [Deployment](#-deployment)
15. [Contributing](#-contributing)

---

## Overview

**Sessions Marketplace** is an educational platform where:
- **Users** browse and book educational sessions from creators
- **Creators** create, manage, and monetize their educational sessions
- Secure authentication with JWT and OAuth support
- Payment tracking and booking management
- Dual dashboards for users and creators

**Perfect for**: Online tutoring platforms, skill-sharing marketplaces, expert consultation services, and educational content delivery.

---

## Features

### Core Features

- **Dual Authentication**
  - Email/Password registration and login
  - OAuth integration (Google & GitHub)
  - JWT token-based security with auto-refresh
  - Secure session management

- **Role-Based Access Control**
  - User role: Browse and book sessions
  - Creator role: Create and manage sessions
  - Admin role: Full system management
  - Distinct interfaces for each role

- **Session Management**
  - Create, read, update, delete sessions
  - Session filtering and search
  - Max participant limits
  - Session status tracking (active, inactive, completed)

- **Booking System**
  - Complete booking workflow
  - Date/time scheduling
  - Booking status tracking (confirmed, cancelled)
  - Revenue tracking for creators

- **User Profiles**
  - Update personal information
  - Avatar/profile picture support
  - Profile completion tracking
  - Account preferences

- **Dual Dashboards**
  - User Dashboard: View active bookings, upcoming sessions
  - Creator Dashboard: Manage sessions, view bookings, track revenue
  - Real-time statistics and analytics

### Technical Features

- **Docker & Docker Compose**
  - One-command deployment
  - Multi-container orchestration
  - Automatic service restart
  - Volume management for persistence

- **RESTful API**
  - Clean, well-documented endpoints
  - Django REST Framework
  - Pagination and filtering
  - Comprehensive error handling

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Mobile-first approach
  - Professional styling
  - Smooth animations and transitions

- **Production Ready**
  - Nginx reverse proxy
  - PostgreSQL database
  - Environment-based configuration
  - Security best practices

-  **Security**
  - CORS configuration
  - SQL injection prevention
  - CSRF protection
  - Password hashing (bcrypt)
  - JWT token security

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI component library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | HTTP client for API requests |
| **React Context** | State management |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Django 5.0** | Web framework |
| **Django REST Framework** | API development |
| **Simple JWT** | Token authentication |
| **Django Allauth** | OAuth integration |
| **PostgreSQL** | Database |
| **Gunicorn** | WSGI server |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Nginx** | Reverse proxy & load balancer |
| **Docker** | Containerization |
| **Docker Compose** | Container orchestration |
| **PostgreSQL 15** | Relational database |

---

## Project Structure

```
sessions-marketplace/
│
├── 📁 frontend/                         # Next.js Frontend
│   ├── public/                          # Static assets
│   ├── src/
│   │   ├── app/                         # App Router pages
│   │   │   ├── page.jsx                 # Home page
│   │   │   ├── login/page.js            # Authentication page
│   │   │   ├── sessions/[id]/page.js    # Session details
│   │   │   ├── dashboard/page.js        # User dashboard
│   │   │   ├── creator-dashboard/page.js# Creator dashboard
│   │   │   ├── profile/page.js          # Profile settings
│   │   │   ├── layout.js                # Root layout
│   │   │   └── globals.css              # Global styles
│   │   ├── components/                  # React components
│   │   │   ├── Navbar.js                # Navigation bar
│   │   │   ├── SessionCard.js           # Session display
│   │   │   └── PrivateRoute.js          # Auth guard
│   │   └── lib/                         # Utility functions
│   │       ├── api.js                   # Axios instance
│   │       ├── auth.js                  # Auth helpers
│   │       └── AuthContext.js           # Auth state
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── 📁 backend/                          # Django Backend
│   ├── config/                          # Django configuration
│   │   ├── settings.py                  # Django settings
│   │   ├── urls.py                      # URL routing
│   │   └── wsgi.py                      # WSGI config
│   ├── users/                           # User management
│   │   ├── models.py                    # User model
│   │   ├── serializers.py               # DRF serializers
│   │   ├── views.py                     # API views
│   │   ├── admin.py                     # Admin config
│   │   └── urls.py                      # App URLs
│   ├── session_catalog/                 # Sessions app
│   │   ├── models.py                    # Session model
│   │   ├── serializers.py               # Serializers
│   │   ├── views.py                     # ViewSets
│   │   └── admin.py                     # Admin config
│   ├── bookings/                        # Bookings app
│   │   ├── models.py                    # Booking model
│   │   ├── serializers.py               # Serializers
│   │   ├── views.py                     # ViewSets
│   │   └── admin.py                     # Admin config
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📁 nginx/                            # Reverse Proxy
│   ├── nginx.conf                       # Nginx configuration
│   └── Dockerfile
│
├── 📄 docker-compose.yml                # Container orchestration
├── 📄 .env.example                      # Environment template
├── 📄 .gitignore
└── 📄 README.md                         # This file

```

---

## Quick Start

### Prerequisites

**Required**:
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Git
- 8GB RAM minimum
- Ports available: 80, 3000, 8000, 5432

**Optional**:
- Python 3.11+ (for local development)
- Node.js 18+ (for local frontend development)
- PostgreSQL client (psql)

### Installation (Docker - Recommended)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/sessions-marketplace.git
cd sessions-marketplace

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up --build

# 4. Create superuser (in another terminal)
docker-compose exec backend python manage.py createsuperuser
```

** That's it!** Your application is now running at:

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost/api |
| Admin Panel | http://localhost/admin |

### Installation (Local Development)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup PostgreSQL locally and update settings.py

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

---

## Environment Setup

### .env Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Environment Variables Reference

```env
# ======================
# DATABASE
# ======================
POSTGRES_DB=sessionsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123          # Change in production!
POSTGRES_HOST=db
POSTGRES_PORT=5432

# ======================
# DJANGO
# ======================
SECRET_KEY=django-insecure-CHANGE-THIS  # Change in production!
DEBUG=True                               # False in production
ALLOWED_HOSTS=localhost,127.0.0.1

# ======================
# FRONTEND
# ======================
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# ======================
# OAUTH (Optional - See OAuth Setup)
# ======================
# GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your-client-secret
# GITHUB_CLIENT_ID=your-github-id
# GITHUB_CLIENT_SECRET=your-github-secret
```

### Security Notes

**Important**:
- Never commit `.env` to version control
- Change `SECRET_KEY` in production
- Use strong `POSTGRES_PASSWORD`
- Set `DEBUG=False` in production
- Update `ALLOWED_HOSTS` for your domain

---

## OAuth Configuration (Optional)

**OAuth is fully optional!** The app works perfectly with email/password authentication. OAuth adds social login convenience.

### Why OAuth is Optional

Email/password authentication works immediately (no setup needed)
OAuth demonstrates production-ready patterns
Setup takes ~5 minutes per provider
Useful for real-world applications

### Google OAuth Setup

<details>
<summary><b> Click to expand Google OAuth instructions</b></summary>

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** → **"New Project"**
3. Enter name: `Sessions Marketplace`
4. Click **"Create"** and wait for completion

#### Step 2: Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click it and press **"Enable"**

#### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **"External"** → Click **"Create"**
3. Fill required fields:
   - **App name**: `Sessions Marketplace`
   - **User support email**: `your-email@example.com`
   - **Developer contact**: `your-email@example.com`
4. Click **"Save and Continue"** through all steps
5. Skip "Scopes" and "Test users"

#### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application type: **"Web application"**
4. Name: `Sessions Marketplace Web`
5. **Authorized redirect URIs** - Add:
   ```
   http://localhost:8000/accounts/google/login/callback/
   ```
6. Click **"Create"**
7. **Copy your Client ID and Client Secret** (you'll need these)

#### Step 5: Add to Django Admin

1. Go to http://localhost/admin
2. Login with superuser credentials
3. Navigate to **"Social applications"** → **"Add social application"**
4. Fill in:
   - **Provider**: `Google`
   - **Name**: `Google OAuth`
   - **Client id**: (paste your Client ID)
   - **Secret key**: (paste your Client Secret)
   - **Sites**: Select `example.com` → Click arrow to move to "Chosen sites"
5. Click **"Save"**

 **Google OAuth is ready!**

</details>

### GitHub OAuth Setup

<details>
<summary><b>👉 Click to expand GitHub OAuth instructions</b></summary>

#### Step 1: Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: `Sessions Marketplace`
   - **Homepage URL**: `http://localhost`
   - **Authorization callback URL**: 
     ```
     http://localhost:8000/accounts/github/login/callback/
     ```
4. Click **"Register application"**

#### Step 2: Get Credentials

1. You'll see your **Client ID**
2. Click **"Generate a new client secret"**
3. **Copy both immediately** (secret shows only once)

#### Step 3: Add to Django Admin

1. Go to http://localhost/admin
2. Login with superuser
3. Go to **"Social applications"** → **"Add social application"**
4. Fill in:
   - **Provider**: `GitHub`
   - **Name**: `GitHub OAuth`
   - **Client id**: (paste your Client ID)
   - **Secret key**: (paste your Client Secret)
   - **Sites**: Select `example.com` → Move to "Chosen sites"
5. Click **"Save"**

 **GitHub OAuth is ready!**

</details>

### Testing OAuth

After setup, test at: http://localhost/login

Click **"Continue with Google"** or **"Continue with GitHub"** → Authorize → Auto-login

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication

All protected endpoints require JWT token:
```
Authorization: Bearer <access_token>
```

### Core Endpoints

#### Authentication

```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "role": "user"
}
```

```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

```http
GET /api/auth/profile/
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg"
}
```

```http
PUT /api/auth/profile/
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "avatar": "https://example.com/new-avatar.jpg"
}

Response: 200 OK (returns updated profile)
```

#### Sessions

```http
GET /api/sessions/
Response: 200 OK

[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "React Advanced Patterns",
    "description": "Learn advanced React patterns...",
    "duration": 90,
    "price": "149.99",
    "max_participants": 10,
    "status": "active",
    "creator_details": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "johndoe",
      "first_name": "John"
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

```http
GET /api/sessions/{id}/
Response: 200 OK

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "React Advanced Patterns",
  "description": "Learn advanced React patterns...",
  "duration": 90,
  "price": "149.99",
  "max_participants": 10,
  "status": "active",
  "image_url": null,
  "creator_details": { ... },
  "created_at": "2024-01-15T10:30:00Z"
}
```

```http
POST /api/sessions/
Authorization: Bearer <creator_token>
Content-Type: application/json

{
  "title": "Python Masterclass",
  "description": "Complete Python guide",
  "duration": 120,
  "price": "99.99",
  "max_participants": 15,
  "image_url": "https://example.com/image.jpg",
  "status": "active"
}

Response: 201 Created
```

```http
PUT /api/sessions/{id}/
Authorization: Bearer <creator_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "price": "129.99"
}

Response: 200 OK
```

```http
DELETE /api/sessions/{id}/
Authorization: Bearer <creator_token>

Response: 204 No Content
```

#### Bookings

```http
POST /api/bookings/
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "session": "550e8400-e29b-41d4-a716-446655440000",
  "booking_date": "2024-01-20T14:00:00Z"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "session": "550e8400-e29b-41d4-a716-446655440000",
  "user": "550e8400-e29b-41d4-a716-446655440003",
  "booking_date": "2024-01-20T14:00:00Z",
  "status": "confirmed",
  "amount": "149.99",
  "created_at": "2024-01-15T10:30:00Z"
}
```

```http
GET /api/bookings/my_bookings/
Authorization: Bearer <user_token>

Response: 200 OK
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "session_details": { ... },
    "booking_date": "2024-01-20T14:00:00Z",
    "status": "confirmed",
    "amount": "149.99",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

```http
GET /api/bookings/creator_bookings/
Authorization: Bearer <creator_token>

Response: 200 OK
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "session_details": { ... },
    "user_details": { ... },
    "booking_date": "2024-01-20T14:00:00Z",
    "status": "confirmed",
    "amount": "149.99"
  }
]
```

```http
PATCH /api/bookings/{id}/
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "status": "cancelled"
}

Response: 200 OK
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

##  API Testing Guide

### Using Postman

#### 1. Import Requests

Create a new Postman Collection named `Sessions Marketplace`:

```json
{
  "info": {
    "name": "Sessions Marketplace API",
    "description": "Complete API testing collection"
  }
}
```

#### 2. Register Test User

```
POST http://localhost:8000/api/auth/register/

Body (JSON):
{
  "email": "testuser@example.com",
  "username": "testuser",
  "password": "Test123!@#",
  "first_name": "Test",
  "last_name": "User"
}

Expected: 201 Created
```

#### 3. Login Test User

```
POST http://localhost:8000/api/auth/login/

Body (JSON):
{
  "email": "testuser@example.com",
  "password": "Test123!@#"
}

Response (save these):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": { ... }
}
```

#### 4. Get Profile

```
GET http://localhost:8000/api/auth/profile/

Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Expected: 200 OK with user details
```

#### 5. Get All Sessions

```
GET http://localhost:8000/api/sessions/

Expected: 200 OK with array of sessions
```

#### 6. Get Single Session

```
GET http://localhost:8000/api/sessions/550e8400-e29b-41d4-a716-446655440000/

Expected: 200 OK with session details
```

#### 7. Create Booking (User)

```
POST http://localhost:8000/api/bookings/

Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Body (JSON):
{
  "session": "550e8400-e29b-41d4-a716-446655440000",
  "booking_date": "2024-02-20T14:00:00Z"
}

Expected: 201 Created with booking details
```

#### 8. Get My Bookings (User)

```
GET http://localhost:8000/api/bookings/my_bookings/

Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

Expected: 200 OK with user's bookings
```

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "Test123!@#",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Test123!@#"
  }'

# Get Sessions
curl -X GET http://localhost:8000/api/sessions/

# Get Profile (with token)
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create Booking
curl -X POST http://localhost:8000/api/bookings/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session": "session-uuid",
    "booking_date": "2024-02-20T14:00:00Z"
  }'
```

### Using Python (Requests Library)

```python
import requests
import json

BASE_URL = "http://localhost:8000/api"

# Register
response = requests.post(
    f"{BASE_URL}/auth/register/",
    json={
        "email": "user@example.com",
        "username": "testuser",
        "password": "Test123!@#",
        "first_name": "Test",
        "last_name": "User"
    }
)
print("Register:", response.status_code, response.json())

# Login
response = requests.post(
    f"{BASE_URL}/auth/login/",
    json={
        "email": "user@example.com",
        "password": "Test123!@#"
    }
)
tokens = response.json()
access_token = tokens['access']
print("Login:", response.status_code)

# Get Sessions
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(f"{BASE_URL}/sessions/", headers=headers)
sessions = response.json()
print("Sessions:", response.status_code, len(sessions), "sessions found")

# Get Profile
response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
print("Profile:", response.status_code, response.json())

# Create Booking
if sessions:
    session_id = sessions[0]['id']
    response = requests.post(
        f"{BASE_URL}/bookings/",
        headers=headers,
        json={
            "session": session_id,
            "booking_date": "2024-02-20T14:00:00Z"
        }
    )
    print("Booking:", response.status_code, response.json())

# Get My Bookings
response = requests.get(f"{BASE_URL}/bookings/my_bookings/", headers=headers)
print("My Bookings:", response.status_code, response.json())
```

---

## 🎮 Demo Flow & Scenarios

### Pre-Configured Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Creator | creator@test.com | test123 | Create sessions, manage bookings |
| User | user@test.com | test123 | Browse sessions, make bookings |

**Note**: Create admin account manually:
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Scenario 1: User Books a Session

```
Step 1: Login as User
  - Email: user@test.com
  - Password: test123
  
Step 2: Browse Sessions
  - Home page shows available sessions
  - Click on session card for details
  
Step 3: Book Session
  - Scroll to booking section
  - Select date/time
  - Click "Book Now"
  - Confirm payment amount
  
Step 4: Verify Booking
  - Navigate to Dashboard
  - See booking in "Active Bookings"
  - View booking details and status
```

### Scenario 2: Creator Creates and Manages Sessions

```
Step 1: Login as Creator
  - Email: creator@test.com
  - Password: test123
  
Step 2: Create Session
  - Go to Creator Dashboard
  - Click "+ Create Session"
  - Fill in details:
    * Title: "Advanced Python"
    * Duration: 90 minutes
    * Price: $99.99
    * Max participants: 20
  - Click "Create"
  
Step 3: Edit Session
  - Find session in "My Sessions"
  - Click "Edit"
  - Update details
  - Click "Update"
  
Step 4: View Bookings
  - Scroll to "Recent Bookings"
  - See all users who booked your sessions
  - View revenue statistics
  
Step 5: Delete Session (Optional)
  - Click "Delete" on session card
  - Confirm deletion
```

### Scenario 3: Complete Workflow

```
PART A: As Creator
  1. Login (creator@test.com)
  2. Create "Python Masterclass" ($99.99, 2 hours)
  3. Add "React Workshop" ($149.99, 1.5 hours)
  4. Logout

PART B: As User
  5. Login (user@test.com)
  6. Browse sessions
  7. Book "Python Masterclass" for tomorrow 2:00 PM
  8. Navigate to Dashboard
  9. See booking confirmed
  10. Logout

PART C: Back as Creator
  11. Login (creator@test.com)
  12. View Creator Dashboard
  13. Check "Recent Bookings" - see user's booking
  14. View revenue stats ($99.99 earned)
  15. Logout

PART D: As Admin
  16. Login to admin panel (/admin)
  17. View all users
  18. View all sessions
  19. View all bookings
  20. Check system statistics
```

### Scenario 4: Profile Management

```
Step 1: Login
  - User or Creator account
  
Step 2: Navigate to Profile
  - Click "Profile" in navbar
  
Step 3: Update Information
  - Change first/last name
  - Update avatar URL
  - Change password (if available)
  
Step 4: Save Changes
  - Click "Save Profile"
  - See success message
  
Step 5: Verify Changes
  - Refresh page
  - Check navbar shows updated name
```

---

## Development Guide

### Setup Development Environment

#### Backend Development

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env with database config
DATABASE_NAME=local_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Server runs at http://localhost:8000
```

#### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Server runs at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

### Creating Test Data

```bash
# Access Django shell
docker-compose exec backend python manage.py shell

# Create test users
from users.models import User

creator = User.objects.create_user(
    username='testcreator',
    email='creator@test.com',
    password='test123',
    role='creator',
    first_name='Test',
    last_name='Creator'
)

user = User.objects.create_user(
    username='testuser',
    email='user@test.com',
    password='test123',
    role='user',
    first_name='Test',
    last_name='User'
)

# Create test sessions
from session_catalog.models import Session

session = Session.objects.create(
    creator=creator,
    title='Test Session',
    description='Learn amazing things',
    duration=60,
    price=49.99,
    max_participants=10,
    status='active'
)

print("Created test data successfully!")
exit()
```

### Database Migrations

```bash
# Create migrations after model changes
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Check migration status
docker-compose exec backend python manage.py showmigrations

# Revert last migration
docker-compose exec backend python manage.py migrate app_name zero
```

### Accessing Django Admin

```bash
# Admin URL
http://localhost/admin

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# In admin, you can:
# - Manage users and their roles
# - Create/edit/delete sessions
# - View and manage bookings
# - Add OAuth social applications
# - Monitor system statistics
```

### Common Development Tasks

#### Add a New API Endpoint

```python
# backend/your_app/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    
    @action(detail=True, methods=['post'])
    def custom_action(self, request, pk=None):
        # Your logic here
        return Response({'status': 'success'})
```

#### Update Frontend to Call API

```javascript
// frontend/src/lib/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSession = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/sessions/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};
```

---

##  Implementation Checklist

### Phase 1: Setup 
- [x] Initialize project structure
- [x] Setup Docker & Docker Compose
- [x] Configure Django + DRF
- [x] Setup Next.js frontend
- [x] Configure Nginx reverse proxy
- [x] Setup PostgreSQL database

### Phase 2: Authentication 
- [x] Implement user registration
- [x] Implement email/password login
- [x] Setup JWT authentication
- [x] Create auth context (React)
- [x] Implement logout functionality
- [x] Add OAuth integration (Google/GitHub)
- [x] Create PrivateRoute component

### Phase 3: Core Features 
- [x] Create User model (with roles)
- [x] Create Session model
- [x] Create Booking model
- [x] Implement SessionViewSet (CRUD)
- [x] Implement BookingViewSet (CRUD)
- [x] Add filtering and pagination
- [x] Implement session search

### Phase 4: Frontend Pages 
- [x] Home page with session listing
- [x] Session detail page
- [x] Login/Register page
- [x] User dashboard
- [x] Creator dashboard
- [x] Profile page
- [x] Responsive navbar

### Phase 5: Advanced Features 
- [x] Booking status tracking
- [x] Revenue calculation
- [x] Session status filtering
- [x] User role-based access
- [x] Profile picture/avatar
- [x] Create session functionality
- [x] Edit/Delete sessions (creators only)

### Phase 6: Polish & Deployment 
- [x] Responsive design (mobile-first)
- [x] Error handling
- [x] Loading states
- [x] Success notifications
- [x] Input validation
- [x] Security headers
- [x] CORS configuration
- [x] Docker production build

### Phase 7: Testing & Documentation 
- [x] API documentation
- [x] Testing guide
- [x] Demo scenarios
- [x] Troubleshooting guide
- [x] Deployment guide
- [x] Development guide

### Phase 8: Optional Enhancements

- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Session reviews & ratings
- [ ] Messaging system
- [ ] Calendar view
- [ ] Analytics dashboard
- [ ] Automated backups
- [ ] CI/CD pipeline

---

##  Troubleshooting

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill the process
sudo kill -9 <PID>

# Or use different port in docker-compose.yml
ports:
  - "8080:80"  # Use 8080 instead of 80
```

### Database Connection Failed

```bash
# Check database logs
docker-compose logs db

# Verify database is running
docker-compose ps

# Wait for database to initialize (first run takes 30-60 seconds)
docker-compose logs -f db

# If still failing, reset database
docker-compose down -v
docker-compose up --build
```

### Frontend Can't Reach Backend

```bash
# Check nginx configuration
docker-compose logs nginx

# Check backend is running
docker-compose logs backend

# Verify CORS settings in Django
# In backend/config/settings.py:
CORS_ALLOWED_ORIGINS = ["http://localhost", "http://localhost:3000"]

# Restart all services
docker-compose restart
```

### OAuth Redirect Mismatch

```
Error: redirect_uri_mismatch

Solution:
1. Verify redirect URI matches EXACTLY:
   http://localhost:8000/accounts/google/login/callback/
   
2. Check in OAuth provider settings
3. No trailing slash differences
4. Exact protocol match (http vs https)
5. Update OAuth credentials in Django admin
```

### Container Keeps Restarting

```bash
# Check logs
docker-compose logs backend

# Common solutions:
# 1. Missing dependencies
docker-compose build --no-cache backend

# 2. Database not ready
# Wait for database, then restart
docker-compose up db
sleep 30
docker-compose up backend

# 3. Syntax error in code
# Fix the error, then rebuild
docker-compose build backend
```

### Permission Denied Errors

```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Windows
# Run Docker Desktop as Administrator
```

### Docker Commands Quick Reference

```bash
# View all containers and status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild a service
docker-compose build [service_name]

# Execute command in container
docker-compose exec backend python manage.py [command]

# Access Python shell
docker-compose exec backend python manage.py shell

# Access PostgreSQL
docker-compose exec db psql -U postgres -d sessionsdb

# View resource usage
docker stats

# Clean up unused Docker resources
docker system prune -a --volumes
```

### Reset Everything (Clean Slate)

```bash
# WARNING: This removes all containers and volumes

# Stop and remove everything
docker-compose down -v

# Remove all local Docker resources
docker system prune -a --volumes

# Rebuild from scratch
docker-compose up --build
```

---

##  Deployment

### Pre-Deployment Checklist

```
Security:
  [ ] Change SECRET_KEY in settings.py
  [ ] Set DEBUG=False
  [ ] Update ALLOWED_HOSTS
  [ ] Configure HTTPS/SSL
  [ ] Update CORS_ALLOWED_ORIGINS
  [ ] Change POSTGRES_PASSWORD
  [ ] Review security settings
  
Database:
  [ ] Backup PostgreSQL database
  [ ] Test database migrations
  [ ] Verify database connection
  [ ] Setup automated backups
  
Frontend:
  [ ] Run npm run build
  [ ] Test production build locally
  [ ] Optimize images
  [ ] Minify CSS/JS
  [ ] Test responsive design
  
Backend:
  [ ] Run manage.py check
  [ ] Collect static files
  [ ] Test API endpoints
  [ ] Verify all dependencies
  
Infrastructure:
  [ ] Verify all ports are open
  [ ] Configure firewall
  [ ] Setup monitoring
  [ ] Configure logging
  [ ] Test SSL certificates
```

### Environment Variables (Production)

```env
# .env (PRODUCTION)

# ===== SECURITY =====
SECRET_KEY=<generate-strong-key-at-djecrety.ir>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# ===== DATABASE =====
POSTGRES_DB=prod_db
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=<very-strong-password>
POSTGRES_HOST=db
POSTGRES_PORT=5432

# ===== FRONTEND =====
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# ===== SECURITY HEADERS =====
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Deploy to Server

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/sessions-marketplace.git
cd sessions-marketplace

# Copy and configure .env
cp .env.example .env
# Edit .env with production values
nano .env

# Start services with production settings
docker-compose -f docker-compose.yml up -d

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Run migrations
docker-compose exec backend python manage.py migrate

# Setup SSL with Let's Encrypt (optional)
# Use Certbot or similar tools
```

### Monitoring & Maintenance

```bash
# Check container health
docker-compose ps

# Monitor resource usage
docker stats

# View logs
docker-compose logs -f backend

# Backup database
docker-compose exec db pg_dump -U postgres sessionsdb > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres sessionsdb < backup.sql

# Update application
git pull origin main
docker-compose build
docker-compose up -d
```

---

## 🤝 Contributing

### Local Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
docker-compose up
# Test in browser and with API

# 4. Commit changes
git add .
git commit -m "feat: add your feature description"

# 5. Push to GitHub
git push origin feature/your-feature

# 6. Create Pull Request on GitHub
```

### Code Style Guidelines

**Python (Backend)**:
```python
# Follow PEP 8
# Use meaningful variable names
# Add docstrings to functions
# Type hints recommended

def create_session(title: str, price: float) -> Session:
    """Create a new session."""
    return Session.objects.create(title=title, price=price)
```

**JavaScript (Frontend)**:
```javascript
// Use camelCase for variables
// Use PascalCase for components
// Add JSDoc comments
// Functional components preferred

/**
 * Display a session card
 * @param {Object} session - The session data
 * @returns {JSX.Element}
 */
function SessionCard({ session }) {
  return <div>{session.title}</div>;
}
```

### Testing

```bash
# Backend tests
docker-compose exec backend python manage.py test

# Frontend tests
cd frontend
npm test

# API testing
# Use Postman collection (see API Testing Guide section)
```

---

## 📞 Support & Resources

### Getting Help

1. **Check Troubleshooting Section** - Common issues and solutions
2. **Review API Documentation** - Endpoint references
3. **Check Demo Scenarios** - Usage examples
4. **Docker Logs** - `docker-compose logs -f [service]`
5. **Django Admin** - `http://localhost/admin`

### Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Authentication](https://tools.ietf.org/html/rfc7519)

### External Tools

- **Generate SECRET_KEY**: https://djecrety.ir/
- **Test API**: [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/)
- **Diagram**: [Excalidraw](https://excalidraw.com/)
- **JSON Validator**: [JSONLint](https://jsonlint.com/)
- **Regex Tester**: [Regex101](https://regex101.com/)

---

##  Additional Files

### .env.example

```env
# ==============================================
# SESSIONS MARKETPLACE - ENVIRONMENT VARIABLES
# ==============================================

# Copy this file to .env and update values
# Command: cp .env.example .env

# ======================
# DATABASE CONFIGURATION
# ======================
POSTGRES_DB=sessionsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=db
POSTGRES_PORT=5432

# ======================
# DJANGO BACKEND
# ======================
SECRET_KEY=django-insecure-CHANGE-THIS-IN-PRODUCTION-k9m2n4p5q8r1s3t7
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# ======================
# FRONTEND (NEXT.JS)
# ======================
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# ======================
# OAUTH CREDENTIALS (OPTIONAL)
# ======================
# Uncomment and fill in after setting up OAuth apps

# Google OAuth
# GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your-client-secret

# GitHub OAuth
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret

# ======================
# NOTES
# ======================
# 1. Never commit .env file to version control
# 2. Change SECRET_KEY in production (generate at https://djecrety.ir/)
# 3. Use strong POSTGRES_PASSWORD in production
# 4. Set DEBUG=False in production
# 5. OAuth is optional - app works with email/password auth
```

---

## Summary

**Sessions Marketplace** is a complete, production-ready full-stack application featuring:

✅ Dual authentication (email/password + OAuth)
✅ Role-based access control  
✅ Session management & booking system
✅ Beautiful, responsive UI
✅ Comprehensive API documentation
✅ Docker containerization
✅ Complete development guide
✅ Production deployment ready

**Get started in 3 commands**:
```bash
cp .env.example .env
docker-compose up --build
docker-compose exec backend python manage.py createsuperuser
```

Then visit: http://localhost

---

## 📝 License

Built for educational purposes as part of internship assignment.

---

## Author

Created with ❤️ using **Next.js, Django, PostgreSQL, and Docker**

**Last Updated**: January 2025

---

**Questions?** Refer to the [Troubleshooting](#-troubleshooting) section or review the [API Documentation](#-api-documentation).
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
