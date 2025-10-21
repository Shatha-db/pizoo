# 📡 Pizoo API Documentation

Base URL: `https://pizoomatch.preview.emergentagent.com/api`

All API endpoints are prefixed with `/api`.

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Register
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "location": "New York",
  "bio": "Love traveling and photography",
  "interests": ["travel", "photography", "music"],
  "height": "180cm",
  "education": "Bachelor's Degree",
  "work": "Software Engineer",
  "photos": ["url1", "url2"]
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 25,
    ...
  }
}
```

---

### Login
**POST** `/api/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    ...
  }
}
```

---

### Logout
**POST** `/api/auth/logout` 🔒

Logout and update online status to offline.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

### Get Current User
**GET** `/api/auth/me` 🔒

Get the currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "location": "New York",
  "bio": "Love traveling",
  "photos": ["url1", "url2"],
  "interests": ["travel", "photography"],
  "verified": false,
  "online": true,
  "last_active": "2025-10-21T12:00:00Z",
  ...
}
```

---

## 👤 User Management

### Get User by ID
**GET** `/api/users/{user_id}` 🔒

Get another user's public profile.

**Parameters:**
- `user_id` (path): User's UUID

**Response:**
```json
{
  "id": "uuid",
  "name": "Jane Smith",
  "age": 23,
  "gender": "female",
  "location": "Los Angeles",
  "bio": "Fitness enthusiast",
  "photos": ["url1", "url2"],
  "interests": ["fitness", "yoga", "hiking"],
  "verified": true,
  "online": true,
  ...
}
```

---

### Update Profile
**PUT** `/api/users/me` 🔒

Update the current user's profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "New bio",
  "location": "San Francisco",
  "interests": ["tech", "coding"],
  "height": "182cm",
  "education": "Master's Degree",
  "work": "Senior Developer",
  "smoking": "no",
  "drinking": "socially",
  "children": "no",
  "photos": ["new_url1", "new_url2"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Updated",
  ...
}
```

---

### Discover Users
**GET** `/api/users/discover` 🔒

Get a list of potential matches (users not yet swiped on).

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Sarah",
    "age": 26,
    "photos": ["url1"],
    "location": "New York",
    ...
  },
  ...
]
```

---

### Nearby Users
**GET** `/api/users/nearby` 🔒

Get users in the same location.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Mike",
    "age": 28,
    "location": "New York",
    ...
  },
  ...
]
```

---

## 💘 Swipe & Match

### Create Swipe
**POST** `/api/swipes` 🔒

Swipe on a user (like or pass).

**Request Body:**
```json
{
  "to_user_id": "target_user_uuid",
  "action": "like"
}
```

**Response:**
```json
{
  "success": true,
  "is_match": true,
  "match_id": "match_uuid"
}
```

If `is_match` is `true`, both users liked each other and a match was created.

---

### Get Likes Me
**GET** `/api/swipes/likes-me` 🔒

Get users who liked you (but you haven't liked back yet).

**Response:**
```json
[
  {
    "user": {
      "id": "uuid",
      "name": "Emma",
      "age": 24,
      ...
    },
    "liked_at": "2025-10-21T10:00:00Z"
  },
  ...
]
```

---

### Get Matches
**GET** `/api/matches` 🔒

Get all matches for the current user.

**Response:**
```json
[
  {
    "match_id": "match_uuid",
    "user": {
      "id": "uuid",
      "name": "Lisa",
      "age": 27,
      ...
    },
    "last_message": {
      "id": "msg_uuid",
      "content": "Hey! How are you?",
      "sender_id": "uuid",
      "created_at": "2025-10-21T11:00:00Z"
    },
    "unread_count": 2,
    "matched_at": "2025-10-20T15:00:00Z"
  },
  ...
]
```

---

## 💬 Messaging

### Get Messages
**GET** `/api/messages/{match_id}` 🔒

Get all messages for a specific match.

**Parameters:**
- `match_id` (path): Match UUID

**Response:**
```json
[
  {
    "id": "msg_uuid",
    "match_id": "match_uuid",
    "sender_id": "uuid",
    "content": "Hey! How are you?",
    "read": true,
    "created_at": "2025-10-21T11:00:00Z"
  },
  ...
]
```

---

### Send Message
**POST** `/api/messages` 🔒

Send a message in a match.

**Request Body:**
```json
{
  "match_id": "match_uuid",
  "content": "Hi! I'm doing great, thanks!"
}
```

**Response:**
```json
{
  "id": "msg_uuid",
  "match_id": "match_uuid",
  "sender_id": "your_uuid",
  "content": "Hi! I'm doing great, thanks!",
  "read": false,
  "created_at": "2025-10-21T12:00:00Z"
}
```

---

## 🔔 Notifications

### Get Notifications
**GET** `/api/notifications` 🔒

Get all notifications for the current user.

**Response:**
```json
[
  {
    "id": "notif_uuid",
    "user_id": "your_uuid",
    "type": "match",
    "title": "مطابقة جديدة!",
    "message": "لديك مطابقة جديدة مع Sarah",
    "data": {
      "match_id": "match_uuid",
      "user_id": "other_user_uuid"
    },
    "read": false,
    "created_at": "2025-10-21T10:00:00Z"
  },
  ...
]
```

**Notification Types:**
- `match`: New match created
- `like`: Someone liked you
- `message`: New message received

---

### Get Unread Count
**GET** `/api/notifications/unread-count` 🔒

Get the count of unread notifications.

**Response:**
```json
{
  "count": 5
}
```

---

### Mark Notification as Read
**PUT** `/api/notifications/{notification_id}/read` 🔒

Mark a specific notification as read.

**Parameters:**
- `notification_id` (path): Notification UUID

**Response:**
```json
{
  "success": true
}
```

---

### Mark All Notifications as Read
**PUT** `/api/notifications/read-all` 🔒

Mark all notifications as read for the current user.

**Response:**
```json
{
  "success": true
}
```

---

## 🚫 Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "detail": "Email already registered"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Invalid credentials"
}
```
or
```json
{
  "detail": "Token expired"
}
```

**403 Forbidden:**
```json
{
  "detail": "Access denied"
}
```

**404 Not Found:**
```json
{
  "detail": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

---

## 📝 Notes

1. **Authentication**: Most endpoints require a valid JWT token. Include it in the `Authorization` header as `Bearer <token>`.

2. **Date Format**: All timestamps are in ISO 8601 format (UTC): `2025-10-21T12:00:00Z`

3. **UUIDs**: All IDs (user, match, message, notification) are UUIDs (v4).

4. **CORS**: The API allows requests from all origins in development. In production, this should be restricted.

5. **Rate Limiting**: Currently not implemented. Should be added before production launch.

6. **Pagination**: Currently not implemented for list endpoints. All results are returned at once (up to a limit).

---

## 🔧 Development

**Base URL (Development):**
```
http://localhost:8001/api
```

**Base URL (Production):**
```
https://pizoomatch.preview.emergentagent.com/api
```

---

## 📚 Additional Resources

- **OpenAPI/Swagger Docs**: Available at `/docs` (FastAPI auto-generated)
- **ReDoc**: Available at `/redoc` (alternative documentation UI)

---

**Last Updated**: October 21, 2025
