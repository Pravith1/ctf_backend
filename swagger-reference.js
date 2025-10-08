/**
 * SWAGGER API DOCUMENTATION - QUICK REFERENCE
 * 
 * Access at: http://localhost:5000/api-docs
 * 
 * This file contains all Swagger annotations used in the CTF Backend API.
 * Swagger annotations are placed directly above route definitions in the Routes folder.
 */

// ============================================
// AUTHENTICATION ROUTES (/auth)
// ============================================

/**
 * POST /auth/signup
 * - Register new team with @psgtech.ac.in email
 * - Request: { email, team_name, password, year }
 * - Response: User object + JWT cookie
 */

/**
 * POST /auth/login
 * - Login with team_name and password
 * - Request: { team_name, password }
 * - Response: User object + JWT cookie
 */

/**
 * POST /auth/logout
 * - Clear JWT cookie
 * - Response: Success message
 */

// ============================================
// ADMIN ROUTES (/admin) - Requires Admin Role
// ============================================

/**
 * GET /admin/categories
 * - Fetch all categories
 * - Auth: Required (Admin only)
 * - Response: Array of categories
 */

/**
 * POST /admin/categories
 * - Create new category
 * - Auth: Required (Admin only)
 * - Request: { name }
 * - Response: Created category
 */

/**
 * GET /admin/questions
 * - Fetch all questions
 * - Auth: Required (Admin only)
 * - Response: Array of questions with populated category
 */

/**
 * POST /admin/questions
 * - Create new question
 * - Auth: Required (Admin only)
 * - Request: { category, title, description, answer, point, year }
 * - Response: Created question
 */

/**
 * PATCH /admin/questions/:id
 * - Update existing question
 * - Auth: Required (Admin only)
 * - Request: Any question fields to update
 * - Response: Updated question
 */

/**
 * DELETE /admin/questions/:id
 * - Delete question
 * - Auth: Required (Admin only)
 * - Response: Deleted question
 */

// ============================================
// SUBMISSION ROUTES (/submission) - Requires Auth
// ============================================

/**
 * POST /submission
 * - Submit answer to a question
 * - Auth: Required
 * - Request: { question_id, submitted_answer }
 * - Response: { message, isCorrect, pointsAwarded, totalScore, success }
 * - Side Effect: Updates user points, question points (if correct), emits WebSocket event
 */

/**
 * POST /submission/questions
 * - Fetch questions filtered by category and user's year
 * - Auth: Required
 * - Request: { categoryId }
 * - Response: { questions, category, userYear, totalQuestions }
 * - Note: Years 1 & 2 see combined questions
 */

/**
 * GET /submission/categories
 * - Fetch all categories
 * - Auth: Required
 * - Response: Array of categories
 */

// ============================================
// LEADERBOARD ROUTES (/leaderboard) - Public
// ============================================

/**
 * GET /leaderboard
 * - Get current leaderboard rankings
 * - Auth: Not required
 * - Response: Array of { rank, team_name, points, solved_count, user_id }
 * - Sorted by: points DESC, solved_count DESC, createdAt ASC
 */

// ============================================
// WEBSOCKET EVENTS (Not in Swagger)
// ============================================

/**
 * Connection: ws://localhost:5000
 * 
 * Server -> Client Events:
 * - 'welcome': { message }
 * - 'leaderboard_update': { leaderboard, timestamp, updated_user }
 * - 'new_solve': { user_id, team_name, question_title, points_awarded, timestamp }
 * 
 * Client -> Server Events:
 * - 'connection': Auto-triggered on connect
 * - 'disconnect': Auto-triggered on disconnect
 */

// ============================================
// SCHEMAS USED IN SWAGGER
// ============================================

/**
 * User Schema:
 * {
 *   _id: string,
 *   email: string (@psgtech.ac.in),
 *   team_name: string,
 *   year: number (1-4),
 *   point: number,
 *   solved_no: number,
 *   field: 'user' | 'admin'
 * }
 */

/**
 * Category Schema:
 * {
 *   _id: string,
 *   name: string
 * }
 */

/**
 * Question Schema:
 * {
 *   _id: string,
 *   categoryId: string,
 *   title: string,
 *   description: string,
 *   answer: string,
 *   point: number,
 *   year: number,
 *   solved_count: number
 * }
 */

/**
 * Submission Schema:
 * {
 *   _id: string,
 *   user_id: string,
 *   question_id: string,
 *   submitted_answer: string,
 *   iscorrect: boolean,
 *   submitted_at: Date
 * }
 */

// ============================================
// AUTHENTICATION FLOW
// ============================================

/**
 * 1. Signup: POST /auth/signup
 *    - Validates @psgtech.ac.in email
 *    - Creates user with hashed password
 *    - Sets JWT cookie (httpOnly, 1 day expiry)
 * 
 * 2. Login: POST /auth/login
 *    - Finds user by team_name
 *    - Verifies password with bcrypt
 *    - Sets JWT cookie
 * 
 * 3. Protected Routes:
 *    - verifyToken middleware reads JWT from cookie
 *    - Decodes and attaches user to req.user
 * 
 * 4. Admin Routes:
 *    - Additional isAdmin middleware checks user.field === 'admin'
 * 
 * 5. Logout: POST /auth/logout
 *    - Clears JWT cookie
 */

// ============================================
// TESTING WORKFLOW
// ============================================

/**
 * 1. Open http://localhost:5000/api-docs in browser
 * 
 * 2. Test Signup:
 *    - Expand POST /auth/signup
 *    - Click "Try it out"
 *    - Fill in request body with valid data
 *    - Execute
 * 
 * 3. Test Login:
 *    - Expand POST /auth/login
 *    - Use team_name and password from signup
 *    - Execute (JWT cookie is automatically set)
 * 
 * 4. Test Protected Endpoints:
 *    - Now you can test any authenticated endpoint
 *    - The cookie is sent automatically
 * 
 * 5. View Leaderboard:
 *    - GET /leaderboard (no auth needed)
 * 
 * 6. Submit Answer:
 *    - POST /submission with question_id and answer
 *    - Check if points are awarded
 *    - Check leaderboard update
 */
