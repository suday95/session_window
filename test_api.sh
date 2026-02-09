#!/bin/bash
# API Testing Script for Sessions Marketplace
# Make sure the backend is running first: docker-compose up

BASE_URL="http://localhost/api"
AUTH_URL="http://localhost/api/auth"

echo "=== Testing Sessions Marketplace API ==="
echo ""

# 1. Register a User
echo "1. Registering a new user..."
USER_RESPONSE=$(curl -s -X POST "$AUTH_URL/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "TestPass123!",
    "role": "user",
    "first_name": "Test",
    "last_name": "User"
  }')
echo "Response: $USER_RESPONSE"
echo ""

# 2. Register a Creator
echo "2. Registering a new creator..."
CREATOR_RESPONSE=$(curl -s -X POST "$AUTH_URL/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "username": "testcreator",
    "password": "CreatorPass123!",
    "role": "creator",
    "first_name": "Test",
    "last_name": "Creator"
  }')
echo "Response: $CREATOR_RESPONSE"
echo ""

# 3. Login as User
echo "3. Logging in as user..."
USER_LOGIN=$(curl -s -X POST "$AUTH_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPass123!"
  }')
USER_TOKEN=$(echo $USER_LOGIN | grep -o '"access":"[^"]*' | cut -d'"' -f4)
echo "User Token: ${USER_TOKEN:0:50}..."
echo ""

# 4. Login as Creator
echo "4. Logging in as creator..."
CREATOR_LOGIN=$(curl -s -X POST "$AUTH_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "password": "CreatorPass123!"
  }')
CREATOR_TOKEN=$(echo $CREATOR_LOGIN | grep -o '"access":"[^"]*' | cut -d'"' -f4)
echo "Creator Token: ${CREATOR_TOKEN:0:50}..."
echo ""

# 5. Creator creates a session
echo "5. Creator creating a session..."
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/sessions/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CREATOR_TOKEN" \
  -d '{
    "title": "Introduction to Python",
    "description": "Learn Python basics in this interactive session",
    "duration": 60,
    "price": "49.99",
    "max_participants": 10,
    "status": "active"
  }')
SESSION_ID=$(echo "$SESSION_RESPONSE" | jq -r '.id')
echo "Session Created: $SESSION_RESPONSE"
echo "Session ID: $SESSION_ID"
echo ""

# 6. Public catalog (no auth needed)
echo "6. Viewing public session catalog..."
curl -s -X GET "$BASE_URL/sessions/" | head -c 500
echo "..."
echo ""

# 7. View specific session detail
echo "7. Viewing session detail..."
curl -s -X GET "$BASE_URL/sessions/$SESSION_ID/"
echo ""

# 8. User books a session
echo "8. User booking the session..."
BOOKING_PAYLOAD=$(jq -n --arg session "$SESSION_ID" --arg time "2026-02-15T14:00:00Z" --arg date "2026-02-15" '{session: $session, scheduled_time: $time, booking_date: $date}')
echo "Booking Payload: $BOOKING_PAYLOAD"
BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/bookings/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d "$BOOKING_PAYLOAD")
# BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/bookings/" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $USER_TOKEN" \
#   -d "{\"session\": \"$SESSION_ID\", \"scheduled_time\": \"2026-02-15T14:00:00Z\"}")

echo "Booking Response: $BOOKING_RESPONSE"
echo ""

# 9. User views their bookings
echo "9. User viewing their bookings..."
curl -s -X GET "$BASE_URL/bookings/my_bookings/" \
  -H "Authorization: Bearer $USER_TOKEN"
echo ""

# 10. User views profile
echo "10. User viewing profile..."
curl -s -X GET "$AUTH_URL/profile/" \
  -H "Authorization: Bearer $USER_TOKEN"
echo ""

# 11. Creator views their sessions
echo "11. Creator viewing their sessions..."
curl -s -X GET "$BASE_URL/sessions/?my_sessions=true" \
  -H "Authorization: Bearer $CREATOR_TOKEN"
echo ""

# 12. Creator views bookings for their sessions
echo "12. Creator viewing bookings for their sessions..."
curl -s -X GET "$BASE_URL/bookings/creator_bookings/" \
  -H "Authorization: Bearer $CREATOR_TOKEN"
echo ""

echo "=== Testing Complete ==="
