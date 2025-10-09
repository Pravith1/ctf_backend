const express = require('express');
const router = express.Router();
const { 
  handleSubmission, 
  fetchQuestions, 
  fetchCategories, 
  getQuestion,
  fetchSolvedQuestions,
  fetchIncorrectSubmissions,
  isSolvedQuestion
} = require('../controllers/SubmissionController');
const { verifyToken } = require('../middleware/validate');

/**
 * @swagger
 * /submission:
 *   post:
 *     summary: Submit an answer to a question
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *               - submitted_answer
 *             properties:
 *               question_id:
 *                 type: string
 *                 description: The ID of the question being answered
 *                 example: 64f8a1b2c3d4e5f6a7b8c9d0
 *               submitted_answer:
 *                 type: string
 *                 description: The answer being submitted
 *                 example: flag{correct_answer}
 *     responses:
 *       200:
 *         description: Answer submission processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Correct! You earned 100 points.
 *                 isCorrect:
 *                   type: boolean
 *                   example: true
 *                 pointsAwarded:
 *                   type: number
 *                   example: 100
 *                 totalScore:
 *                   type: number
 *                   example: 350
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing required fields or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question ID and submission answer are required.
 *                 success:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/', verifyToken, handleSubmission);

/**
 * @swagger
 * /submission/questions:
 *   post:
 *     summary: Fetch questions by category (filtered by user's year)
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: Category ID to fetch questions for
 *                 example: 64f8a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *                     category:
 *                       type: string
 *                       example: Cryptography
 *                     userYear:
 *                       type: number
 *                       example: 3
 *                     totalQuestions:
 *                       type: number
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: Questions fetched successfully
 *       400:
 *         description: Category ID is required
 *       404:
 *         description: User or category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/questions', verifyToken, fetchQuestions);

/**
 * @swagger
 * /submission/categories:
 *   get:
 *     summary: Fetch all categories
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Categories fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/categories', verifyToken, fetchCategories);

/**
 * @swagger
 * /submission/question:
 *   post:
 *     summary: Get a single question by ID (secure - no answer field)
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *             properties:
 *               question_id:
 *                 type: string
 *                 description: The ID of the question to retrieve
 *                 example: 64f8a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Question fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f8a1b2c3d4e5f6a7b8c9d0
 *                     title:
 *                       type: string
 *                       example: SQL Injection Challenge
 *                     description:
 *                       type: string
 *                       example: Find the hidden flag in the database
 *                     point:
 *                       type: number
 *                       example: 100
 *                     year:
 *                       type: number
 *                       example: 1
 *                     difficulty:
 *                       type: string
 *                       enum: [beginner, intermediate]
 *                       example: beginner
 *                     solved_count:
 *                       type: number
 *                       example: 15
 *                     categoryId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64f8a1b2c3d4e5f6a7b8c9d0
 *                         name:
 *                           type: string
 *                           example: Web Security
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-09-15T10:30:00.000Z
 *                 message:
 *                   type: string
 *                   example: Question fetched successfully
 *       400:
 *         description: Missing question ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Question ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Server error
 */
router.post('/question', verifyToken, getQuestion);

/**
 * @swagger
 * /submission/solved:
 *   post:
 *     summary: Get all correctly solved questions by the user in a specific category
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: Category ID to fetch solved questions for
 *                 example: 64f8a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Successfully fetched solved questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           difficulty:
 *                             type: string
 *                           categoryId:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                           solved_at:
 *                             type: string
 *                             format: date-time
 *                     category:
 *                       type: string
 *                       example: Web Security
 *                     userDifficulty:
 *                       type: string
 *                       example: beginner
 *                     totalSolved:
 *                       type: number
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: Solved questions fetched successfully
 *       400:
 *         description: Missing categoryId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Category ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post('/solved', verifyToken, fetchSolvedQuestions);

/**
 * @swagger
 * /submission/incorrect:
 *   post:
 *     summary: Get unsolved questions (incorrectly attempted + never attempted) by category and difficulty
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category to fetch questions from
 *                 example: "64a1b2c3d4e5f6789abcdef0"
 *     responses:
 *       200:
 *         description: Successfully fetched unsolved questions (no duplicates)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     unsolvedQuestions:
 *                       type: array
 *                       description: Combined list of incorrectly attempted and never attempted questions
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           difficulty:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [attempted_incorrect, never_attempted]
 *                           incorrectAttempts:
 *                             type: number
 *                           lastAttemptAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           categoryId:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                     incorrectlyAttempted:
 *                       type: array
 *                       description: Questions attempted but answered incorrectly
 *                     neverAttempted:
 *                       type: array
 *                       description: Questions never attempted by the user
 *                     category:
 *                       type: string
 *                     userDifficulty:
 *                       type: string
 *                     totalUnsolved:
 *                       type: number
 *                     totalIncorrectlyAttempted:
 *                       type: number
 *                     totalNeverAttempted:
 *                       type: number
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing categoryId or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post('/un-solved', verifyToken, fetchIncorrectSubmissions);

/**
 * @swagger
 * /submission/is-solved:
 *   post:
 *     summary: Check if a specific question is solved by the user
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_id
 *             properties:
 *               question_id:
 *                 type: string
 *                 description: The ID of the question to check
 *                 example: 64f8a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Question solve status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isSolved:
 *                       type: boolean
 *                       description: Whether the question is solved by the user
 *                       example: true
 *                     questionId:
 *                       type: string
 *                       description: The ID of the checked question
 *                       example: 64f8a1b2c3d4e5f6a7b8c9d0
 *                 message:
 *                   type: string
 *                   example: Question is solved
 *       400:
 *         description: Missing question ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Question ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Server error
 */
router.post('/is-solved', verifyToken, isSolvedQuestion);

module.exports = router;