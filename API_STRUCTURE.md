# CTF Backend API Structure

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CTF Backend Server                        │
│                   (Express.js + Node.js)                     │
│                  http://localhost:5000                       │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   HTTP API   │    │  WebSocket   │    │   Swagger    │
│   Routes     │    │   Server     │    │     UI       │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
  API Endpoints      Real-time Events    /api-docs
```

## 📡 API Endpoints Structure

```
CTF Backend API
│
├── 🔐 /auth (Authentication)
│   ├── POST /signup          ➜ Register new team
│   ├── POST /login           ➜ Login with team_name
│   └── POST /logout          ➜ Logout current user
│
├── 👨‍💼 /admin (Admin Only - Requires JWT + Admin Role)
│   ├── GET  /categories      ➜ List all categories
│   ├── POST /categories      ➜ Create category
│   ├── GET  /questions       ➜ List all questions
│   ├── POST /questions       ➜ Create question
│   ├── PATCH /questions/:id  ➜ Update question
│   └── DELETE /questions/:id ➜ Delete question
│
├── 📝 /submission (User - Requires JWT)
│   ├── POST /                ➜ Submit answer
│   ├── POST /questions       ➜ Get questions by category
│   └── GET  /categories      ➜ Get all categories
│
├── 🏆 /leaderboard (Public)
│   └── GET  /                ➜ Get current rankings
│
└── 📚 /api-docs (Swagger UI)
    └── GET  /                ➜ Interactive API docs
```

## 🔄 Request Flow Diagram

### User Registration & Login Flow
```
┌─────────┐           ┌─────────┐           ┌──────────┐
│ Client  │──signup──▶│  Auth   │──create──▶│ MongoDB  │
│ Browser │           │Controller│           │ Database │
└─────────┘           └─────────┘           └──────────┘
     │                     │                      │
     │                     ▼                      │
     │            Check @psgtech.ac.in            │
     │            Hash Password (bcrypt)          │
     │            Generate JWT Token              │
     │                     │                      │
     │◀────Set Cookie──────┤                      │
     │     (httpOnly)                             │
     │                                            │
     │──login──────────────▶                      │
     │  (team_name + pwd)                         │
     │                     │──find user──────────▶│
     │                     │◀─────user────────────┤
     │                     │                      │
     │                Verify Password             │
     │                Generate JWT                │
     │◀────Set Cookie──────┤                      │
     │                                            │
     ▼                                            ▼
[Authenticated]                          [User in DB]
```

### Question Submission Flow
```
┌─────────┐           ┌────────────┐           ┌──────────┐
│ Client  │──submit──▶│Submission  │──verify──▶│ MongoDB  │
│ Browser │  answer   │ Controller │   JWT     │ Database │
└─────────┘           └────────────┘           └──────────┘
     │                     │                      │
     │                     ▼                      │
     │            Extract user from JWT           │
     │            Find question by ID             │
     │                     │                      │
     │                     ├──get user───────────▶│
     │                     ├──get question────────▶│
     │                     │                      │
     │                     ▼                      │
     │            Check if already solved         │
     │            Compare answer                  │
     │                     │                      │
     │         ┌───────────┴───────────┐          │
     │         │                       │          │
     │         ▼                       ▼          │
     │    [Correct]               [Incorrect]     │
     │         │                       │          │
     │    Award Points            Log Attempt     │
     │    Update User                 │          │
     │    Reduce Q Points             │          │
     │    Save Submission            Save        │
     │         │                       │          │
     │         ▼                       ▼          │
     │    ┌────────────┐         ┌──────────┐    │
     │    │ WebSocket  │         │   JSON   │    │
     │◀───│  Broadcast │         │ Response │───▶│
     │    │Leaderboard │         └──────────┘    │
     │    └────────────┘                         │
     ▼                                            ▼
[Real-time                              [Points Updated]
 Update]
```

### Admin Question Management Flow
```
┌─────────┐           ┌────────────┐           ┌──────────┐
│  Admin  │──create──▶│   Admin    │──verify──▶│ MongoDB  │
│ Client  │ question  │ Controller │  JWT +    │ Database │
└─────────┘           └────────────┘  isAdmin  └──────────┘
     │                     │                      │
     │                     ▼                      │
     │            Check JWT (verifyToken)         │
     │            Check isAdmin (field)           │
     │                     │                      │
     │                     ▼                      │
     │         ┌───────────┴───────────┐          │
     │         │                       │          │
     │         ▼                       ▼          │
     │    [Authorized]            [Denied]        │
     │         │                       │          │
     │    Find/Create Category         │          │
     │    Create Question              │          │
     │         │                       │          │
     │         │──save───────────────▶ │          │
     │         │                       │          │
     │◀────response─────┘              │          │
     │                                 │          │
     │                        403 Forbidden       │
     │◀────────────────────────────────┘          │
     ▼                                            ▼
[Question Created]                        [Error Response]
```

## 🗄️ Database Schema Relationships

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ _id             │◀──┐
│ email           │   │
│ team_name       │   │
│ password        │   │
│ year            │   │
│ point           │   │
│ solved_no       │   │
│ field (role)    │   │
└─────────────────┘   │
                      │
                      │ user_id (FK)
                      │
┌─────────────────┐   │
│   Submission    │   │
├─────────────────┤   │
│ _id             │   │
│ user_id         │───┘
│ question_id     │───┐
│ submitted_ans   │   │
│ iscorrect       │   │
│ submitted_at    │   │
└─────────────────┘   │
                      │
                      │ question_id (FK)
                      │
┌─────────────────┐   │
│    Question     │   │
├─────────────────┤   │
│ _id             │◀──┘
│ categoryId      │───┐
│ title           │   │
│ description     │   │
│ answer          │   │
│ point           │   │
│ year            │   │
│ solved_count    │   │
└─────────────────┘   │
                      │
                      │ categoryId (FK)
                      │
┌─────────────────┐   │
│    Category     │   │
├─────────────────┤   │
│ _id             │◀──┘
│ name            │
└─────────────────┘
```

## 🔒 Authentication & Authorization Layers

```
                    Incoming Request
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  1. Cookie Parser Middleware    │
        │     Parses JWT from cookie      │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  2. CORS Middleware             │
        │     Validates origin            │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  3. Route Handler               │
        │     Matches endpoint            │
        └─────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
        [Public Route]          [Protected Route]
              │                       │
              │                       ▼
              │         ┌─────────────────────────────┐
              │         │  4. verifyToken Middleware  │
              │         │     - Extract JWT cookie    │
              │         │     - Verify signature      │
              │         │     - Decode user data      │
              │         │     - Attach to req.user    │
              │         └─────────────────────────────┘
              │                       │
              │                       │
              │           ┌───────────┴───────────┐
              │           │                       │
              │           ▼                       ▼
              │      [User Route]           [Admin Route]
              │           │                       │
              │           │                       ▼
              │           │         ┌─────────────────────────┐
              │           │         │  5. isAdmin Middleware  │
              │           │         │     - Check user.field  │
              │           │         │     - Must be 'admin'   │
              │           │         └─────────────────────────┘
              │           │                       │
              ▼           ▼                       ▼
        [Controller]  [Controller]          [Controller]
              │           │                       │
              └───────────┴───────────────────────┘
                          │
                          ▼
                    [Response]
```

## 📊 Data Flow Patterns

### Read Operations (GET)
```
Client ──▶ Middleware ──▶ Controller ──▶ Model ──▶ MongoDB
   ▲                                                   │
   │                                                   │
   └──────────────── Response ◀──────────────────────┘
```

### Write Operations (POST/PATCH/DELETE)
```
Client ──▶ Middleware ──▶ Controller ──▶ Validation
                              │
                              ▼
                         Transaction Start
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                 Model 1   Model 2   Model 3
                    │         │         │
                    └─────────┼─────────┘
                              │
                         Transaction Commit
                              │
                    ┌─────────┼─────────┐
                    ▼                   ▼
             WebSocket Emit      JSON Response
                    │                   │
                    ▼                   ▼
            All Clients ◀──────────── Client
```

## 🌐 WebSocket Architecture

```
                    Socket.IO Server
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
        [Connection Pool]      [Event Emitter]
              │                       │
              │                       │
        ┌─────┴─────┐        ┌────────┴────────┐
        ▼           ▼        ▼                 ▼
    Client A    Client B   'leaderboard_    'new_solve'
                            update'
        │           │        │                 │
        └───────────┴────────┴─────────────────┘
                          │
                          ▼
              Real-time Leaderboard Updates
```

## 🎯 Complete User Journey

```
1. REGISTRATION
   POST /auth/signup
   ↓
   Validate @psgtech.ac.in email
   ↓
   Create user with hashed password
   ↓
   Set JWT cookie
   ↓
   User logged in ✓

2. BROWSE CHALLENGES
   GET /submission/categories
   ↓
   POST /submission/questions
   ↓
   Display questions filtered by year
   ↓
   User sees available challenges ✓

3. SUBMIT ANSWER
   POST /submission
   ↓
   Verify JWT token
   ↓
   Check if already solved
   ↓
   Compare answer with correct answer
   ↓
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
CORRECT           INCORRECT
   │                   │
Award points      Log attempt
Update user       Return false
Reduce Q points   ↓
Emit WebSocket    User tries again
   ↓
Leaderboard updates ✓

4. CHECK RANKING
   GET /leaderboard
   ↓
   Sorted by points DESC, solved_count DESC
   ↓
   User sees their rank ✓

5. ADMIN ADDS QUESTION
   POST /admin/questions
   ↓
   Verify JWT + isAdmin
   ↓
   Find/Create category
   ↓
   Create question
   ↓
   New challenge available ✓
```

This structure provides a complete visual representation of your CTF Backend architecture!
