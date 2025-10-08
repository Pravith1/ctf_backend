const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user/team
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - team_name
 *               - password
 *               - year
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be a @psgtech.ac.in email
 *                 example: team@psgtech.ac.in
 *               team_name:
 *                 type: string
 *                 description: Unique team name
 *                 example: CyberWarriors
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Strong password
 *                 example: SecurePass123!
 *               year:
 *                 type: number
 *                 description: Academic year (1-4)
 *                 example: 3
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     team_name:
 *                       type: string
 *                     year:
 *                       type: number
 *                     field:
 *                       type: string
 *       400:
 *         description: Invalid input or email not @psgtech.ac.in
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with team name and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team_name
 *               - password
 *             properties:
 *               team_name:
 *                 type: string
 *                 description: Team name
 *                 example: CyberWarriors
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Team password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     team_name:
 *                       type: string
 *                     year:
 *                       type: number
 *                     field:
 *                       type: string
 *       400:
 *         description: Missing team name or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 */
router.post('/logout', authController.logout);

module.exports = router;
