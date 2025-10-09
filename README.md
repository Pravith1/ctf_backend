# 🚩 CTF Backend

A Capture The Flag (CTF) competition backend built with EFor detailed setup instructions, see [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)

## 🌐 CORS Configuration for Deployment

### Problem: Can't access Render backend from localhost frontend

When you deploy your backend to Render and try to access it from your localhost frontend, you might encounter CORS errors. This happens because the backend is configured to only accept requests from specific origins.

### Solution: Configure Environment Variables

1. **On Render (Production Backend)**:
   - Go to your Render dashboard → Your service → Environment
   - Add environment variable: `FRONTEND_URL=http://localhost:5173`
   - If your frontend is also deployed, use: `FRONTEND_URL=https://your-frontend.vercel.app`
   - Redeploy your backend service

2. **For local development (.env file)**:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

3. **For multiple frontend URLs** (local + deployed):
   - The backend is configured to accept multiple origins
   - It automatically allows:
     - `http://localhost:3000`
     - `http://localhost:5173`
     - `http://localhost:5174`
     - Whatever URL you set in `FRONTEND_URL` environment variable

### Testing CORS

```bash
# From your frontend directory, test the API
curl -X GET https://your-app.onrender.com/leaderboard \
  -H "Origin: http://localhost:5173" \
  -v
```

### Common Issues

1. **Cookies not working across domains**:
   - When frontend is on `localhost` and backend is on `render.com`, cookies won't work due to browser security
   - Solution: Deploy both frontend and backend, or use localhost for both during development

2. **CORS policy error in browser console**:
   - Check that `FRONTEND_URL` is set correctly in Render environment variables
   - Make sure you've redeployed after adding the environment variable

3. **WebSocket connection failed**:
   - Ensure your frontend connects to the correct WebSocket URL
   - Example: `io('https://your-app.onrender.com', { withCredentials: true })`


## 🛠️ Development Tasks & Ownershipss.js and Node.js. This application provides a comprehensive platform for hosting cybersecurity challenges, managing user authentication, tracking scores, and real-time updates through WebSocket connections.

## 📋 Project Overview

This CTF backend serves as the foundation for cybersecurity competitions, providing:

- **User Management**: Registration, authentication, and profile management
- **Challenge System**: Multi-category cybersecurity challenges with dynamic scoring
- **Admin Dashboard**: Administrative controls for managing competitions, users, and challenges
- **Real-time Features**: Live scoreboards and notifications via WebSockets
- **Secure Architecture**: JWT-based authentication with role-based access control

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pravith1/ctf_backend.git
   cd ctf_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ctf_db
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

4. **Database Setup**
   Ensure MongoDB is running on your system or provide a connection string to your MongoDB instance.

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## 📚 API Documentation

**Swagger UI is available at:** `http://localhost:5000/api-docs`

The CTF Backend includes comprehensive API documentation using Swagger/OpenAPI 3.0. You can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Understand authentication requirements

### Quick Access
- **Interactive Docs**: http://localhost:5000/api-docs
- **JSON Spec**: http://localhost:5000/api-docs.json

For detailed setup instructions, see [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)


## �🛠️ Development Tasks & Ownership

This table outlines the current sprint's major development components and their responsible owners. Please check off your tasks as you complete them.

| Task Component | Owner | Status |
| :--- | :--- | :--- |
| **Authentication, Middleware** | Saran,Mugilan | $\square$ |
| **Admin Controller** | Srimathi | $\checkmark$ |
Dummy asyncHandler, ApiResponse utilities and middleware have been added temporarily for testing the admin controller. These can be replaced with the official team versions later.

| **User Controller: Category Fetch,Question Fetch** | Mugilan | $\square$ |
| **User Controller: Question Submision and point update** | Revanth | $\square$ |
| **User Controller: Question Submission** | User Controller | $\square$ |
| **Web Sockets** | Athilakshmi | $\square$|

**Note:** To mark a task as complete, replace $\square$ with $\checkmark$ or $\otimes$ in the raw markdown file.
