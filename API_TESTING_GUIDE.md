# API Testing Guide - Sessions Marketplace

## Feature Implementation Status

### ✅ IMPLEMENTED
- ✅ JWT Authentication (email/password)
- ✅ Two roles: User & Creator
- ✅ Profile management (view/update name, avatar)
- ✅ Public sessions catalog
- ✅ Session detail page
- ✅ Booking flow
- ✅ User view bookings (active & past)
- ✅ Creator manage sessions
- ✅ User Dashboard data (bookings + profile)
- ✅ Creator Dashboard data (sessions + bookings overview)

### ❌ NOT IMPLEMENTED
- ❌ **OAuth login (Google/GitHub)** - Only email/password auth exists

---

## Prerequisites

1. Start the backend:
```bash
docker-compose up
```

2. Backend should be accessible at: `http://localhost` (via nginx)

---

## Testing Methods

### Method 1: Automated Script (Recommended)

```bash
chmod +x test_api.sh
./test_api.sh
```

### Method 2: Manual cURL Commands

#### 1. Register a User
```bash
curl -X POST http://localhost/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "Pass123!",
    "role": "user",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### 2. Register a Creator
```bash
curl -X POST http://localhost/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "username": "creator",
    "password": "Pass123!",
    "role": "creator",
    "first_name": "Jane",
    "last_name": "Smith"
  }'
```

#### 3. Login as User (Get JWT Token)
```bash
curl -X POST http://localhost/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Pass123!"
  }'
```

**Save the `access` token from the response!**

#### 4. Login as Creator
```bash
curl -X POST http://localhost/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "password": "Pass123!"
  }'
```

**Save the `access` token!**

#### 5. View Profile (Authenticated)
```bash
curl -X GET http://localhost/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 6. Update Profile
```bash
curl -X PATCH http://localhost/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "UpdatedName",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

#### 7. Creator Creates a Session
```bash
curl -X POST http://localhost/api/sessions/ \
  -H "Authorization: Bearer CREATOR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Masterclass",
    "description": "Learn advanced Python techniques",
    "duration": 90,
    "price": "99.99",
    "max_participants": 20,
    "status": "active"
  }'
```

**Save the session `id` from response!**

#### 8. View Public Sessions Catalog (No Auth Required)
```bash
curl -X GET http://localhost/api/sessions/
```

#### 9. View Single Session Detail
```bash
curl -X GET http://localhost/api/sessions/SESSION_ID/
```

#### 10. User Books a Session
```bash
curl -X POST http://localhost/api/bookings/ \
  -H "Authorization: Bearer USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session": "SESSION_ID",
    "scheduled_time": "2026-02-20T15:00:00Z"
  }'
```

#### 11. User Views Their Bookings
```bash
curl -X GET http://localhost/api/bookings/my_bookings/ \
  -H "Authorization: Bearer USER_ACCESS_TOKEN"
```

#### 12. Creator Views Their Sessions
```bash
curl -X GET "http://localhost/api/sessions/?my_sessions=true" \
  -H "Authorization: Bearer CREATOR_ACCESS_TOKEN"
```

#### 13. Creator Views Bookings for Their Sessions
```bash
curl -X GET http://localhost/api/bookings/creator_bookings/ \
  -H "Authorization: Bearer CREATOR_ACCESS_TOKEN"
```

#### 14. Creator Updates a Session
```bash
curl -X PATCH http://localhost/api/sessions/SESSION_ID/ \
  -H "Authorization: Bearer CREATOR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": "79.99",
    "status": "active"
  }'
```

#### 15. Creator Deletes a Session
```bash
curl -X DELETE http://localhost/api/sessions/SESSION_ID/ \
  -H "Authorization: Bearer CREATOR_ACCESS_TOKEN"
```

---

## Method 3: Using Postman or Thunder Client (VS Code Extension)

### Thunder Client Setup (Recommended for VS Code)

1. Install Thunder Client extension in VS Code
2. Import this collection or create requests manually:

**Collection Structure:**

```
Sessions Marketplace
├── Auth
│   ├── Register User
│   ├── Register Creator
│   ├── Login User
│   ├── Login Creator
│   ├── Get Profile
│   └── Update Profile
├── Sessions
│   ├── Get All Sessions (Public)
│   ├── Get Session Detail
│   ├── Create Session (Creator)
│   ├── Update Session (Creator)
│   ├── Delete Session (Creator)
│   └── Get My Sessions (Creator)
└── Bookings
    ├── Create Booking (User)
    ├── Get My Bookings (User)
    ├── Get Creator Bookings (Creator)
    └── Get All Bookings
```

### Setting Environment Variables in Thunder Client:

- `base_url`: `http://localhost/api`
- `auth_url`: `http://localhost/api/auth`
- `user_token`: (paste after login)
- `creator_token`: (paste after login)

---

## Method 4: Python Requests Script

```python
import requests
import json

BASE_URL = "http://localhost/api"
AUTH_URL = "http://localhost/api/auth"

# 1. Register and login user
user_data = {
    "email": "user@test.com",
    "username": "testuser",
    "password": "Pass123!",
    "role": "user",
    "first_name": "Test",
    "last_name": "User"
}
response = requests.post(f"{AUTH_URL}/register/", json=user_data)
print("User registered:", response.json())

# Login
login_response = requests.post(f"{AUTH_URL}/login/", json={
    "email": "user@test.com",
    "password": "Pass123!"
})
user_token = login_response.json()["access"]
print("User token:", user_token[:50] + "...")

# 2. Register and login creator
creator_data = {
    "email": "creator@test.com",
    "username": "testcreator",
    "password": "Pass123!",
    "role": "creator",
    "first_name": "Test",
    "last_name": "Creator"
}
requests.post(f"{AUTH_URL}/register/", json=creator_data)

creator_login = requests.post(f"{AUTH_URL}/login/", json={
    "email": "creator@test.com",
    "password": "Pass123!"
})
creator_token = creator_login.json()["access"]

# 3. Creator creates session
session_data = {
    "title": "Python Workshop",
    "description": "Learn Python from scratch",
    "duration": 60,
    "price": "49.99",
    "max_participants": 15,
    "status": "active"
}
headers = {"Authorization": f"Bearer {creator_token}"}
session_response = requests.post(f"{BASE_URL}/sessions/", json=session_data, headers=headers)
session_id = session_response.json()["id"]
print("Session created:", session_id)

# 4. User books session
booking_data = {
    "session": session_id,
    "scheduled_time": "2026-02-20T14:00:00Z"
}
user_headers = {"Authorization": f"Bearer {user_token}"}
booking_response = requests.post(f"{BASE_URL}/bookings/", json=booking_data, headers=user_headers)
print("Booking created:", booking_response.json())

# 5. User views bookings
my_bookings = requests.get(f"{BASE_URL}/bookings/my_bookings/", headers=user_headers)
print("My bookings:", my_bookings.json())

# 6. Creator views their bookings
creator_bookings = requests.get(f"{BASE_URL}/bookings/creator_bookings/", headers=headers)
print("Creator bookings:", creator_bookings.json())
```

---

## Expected Responses

### Successful Registration
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "username": "testuser",
  "role": "user",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Successful Login
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "testuser",
    "role": "user",
    "avatar": null,
    "first_name": "John",
    "last_name": "Doe"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Session Created
```json
{
  "id": "session-uuid",
  "creator": "creator-uuid",
  "creator_details": {
    "username": "creator",
    "email": "creator@example.com"
  },
  "title": "Python Workshop",
  "description": "Learn Python from scratch",
  "duration": 60,
  "price": "49.99",
  "max_participants": 15,
  "status": "active",
  "created_at": "2026-02-09T..."
}
```

---

## Common Issues & Solutions

### Issue: "Connection refused"
**Solution:** Make sure Docker containers are running:
```bash
docker-compose ps
docker-compose up
```

### Issue: "Authentication credentials were not provided"
**Solution:** Include the Authorization header:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Issue: "Only creators can create sessions"
**Solution:** Make sure you registered with `"role": "creator"` and are using the creator's token.

### Issue: "Invalid credentials"
**Solution:** Check email/password are correct. Email is used as username for login.

---

## Next Steps for Frontend

Once you've verified the backend works:

1. **User Authentication Flow**
   - Login/Register pages
   - Store JWT tokens (localStorage/cookies)
   - Protected routes

2. **Public Pages**
   - Sessions catalog with search/filter
   - Session detail page with booking button

3. **User Dashboard**
   - Profile management
   - Active bookings list
   - Past bookings history

4. **Creator Dashboard**
   - Create/edit sessions form
   - Session list with edit/delete
   - Bookings overview for their sessions

5. **Missing Feature: OAuth**
   - You'll need to implement Google/GitHub OAuth on backend first
   - Or proceed with email/password auth for now

---

## API Endpoint Summary

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/auth/register/` | POST | No | Any | Register new user |
| `/api/auth/login/` | POST | No | Any | Login & get JWT |
| `/api/auth/profile/` | GET/PATCH | Yes | Any | View/update profile |
| `/api/sessions/` | GET | No | Any | Public catalog |
| `/api/sessions/` | POST | Yes | Creator | Create session |
| `/api/sessions/{id}/` | GET | No | Any | Session detail |
| `/api/sessions/{id}/` | PATCH/DELETE | Yes | Creator | Update/delete own session |
| `/api/sessions/?my_sessions=true` | GET | Yes | Creator | Get creator's sessions |
| `/api/bookings/` | POST | Yes | User | Book a session |
| `/api/bookings/my_bookings/` | GET | Yes | User | User's bookings |
| `/api/bookings/creator_bookings/` | GET | Yes | Creator | Bookings for creator's sessions |

