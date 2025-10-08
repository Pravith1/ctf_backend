# Swagger API Documentation Setup

## Installation

Run the following command to install the required Swagger dependencies:

```bash
npm install swagger-jsdoc swagger-ui-express --save
```

## Access the Documentation

Once the server is running, you can access the Swagger documentation at:

**http://localhost:5000/api-docs**

## Features

### 📚 Complete API Documentation
- **Authentication Routes**: Signup, Login, Logout
- **Admin Routes**: Manage categories and questions
- **Submission Routes**: Submit answers, fetch questions and categories
- **Leaderboard Routes**: View current rankings

### 🔐 Security
- JWT cookie-based authentication
- Admin-only endpoints protected
- Email validation for @psgtech.ac.in domain

### 🎯 Interactive Testing
- Test all endpoints directly from the Swagger UI
- See request/response schemas
- Try out authentication flows

## API Endpoints Summary

### Authentication (`/auth`)
- `POST /auth/signup` - Register new team (requires @psgtech.ac.in email)
- `POST /auth/login` - Login with team name and password
- `POST /auth/logout` - Logout current user

### Admin (`/admin`) - Requires Admin Role
- `GET /admin/categories` - Get all categories
- `POST /admin/categories` - Create new category
- `GET /admin/questions` - Get all questions
- `POST /admin/questions` - Create new question
- `PATCH /admin/questions/:id` - Update question
- `DELETE /admin/questions/:id` - Delete question

### Submissions (`/submission`) - Requires Authentication
- `POST /submission` - Submit answer to a question
- `POST /submission/questions` - Get questions by category (filtered by year)
- `GET /submission/categories` - Get all categories

### Leaderboard (`/leaderboard`) - Public
- `GET /leaderboard` - Get current leaderboard rankings

## Testing with Swagger UI

1. Start your server: `npm start` or `npm run dev`
2. Open browser: `http://localhost:5000/api-docs`
3. For authenticated endpoints:
   - First login via `/auth/login` endpoint
   - The JWT cookie will be automatically set
   - Then test other protected endpoints

## WebSocket Events (Not in Swagger)

WebSocket connection available at `http://localhost:5000`

### Server to Client Events:
- `welcome` - Connection acknowledgment
- `leaderboard_update` - Real-time leaderboard updates
- `new_solve` - New question solve notifications

### Client to Server Events:
- `connection` - Connect to server
- `disconnect` - Disconnect from server

## Example Requests

### Signup
```json
POST /auth/signup
{
  "email": "team@psgtech.ac.in",
  "team_name": "CyberWarriors",
  "password": "SecurePass123!",
  "year": 3
}
```

### Login
```json
POST /auth/login
{
  "team_name": "CyberWarriors",
  "password": "SecurePass123!"
}
```

### Submit Answer
```json
POST /submission
{
  "question_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "submitted_answer": "flag{correct_answer}"
}
```

### Create Question (Admin)
```json
POST /admin/questions
{
  "category": "Cryptography",
  "title": "Caesar Cipher Challenge",
  "description": "Decode the following message...",
  "answer": "flag{crypto_master}",
  "point": 100,
  "year": 3
}
```

## Notes

- All authenticated routes require a valid JWT token in cookies
- Admin routes require the user to have `field: 'admin'`
- Leaderboard updates are sent in real-time via WebSocket
- Question points decrease by 5% after each correct submission
- Years 1 and 2 students see combined questions from both years
