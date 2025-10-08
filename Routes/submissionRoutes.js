const express = require('express');
const router = express.Router();
const { handleSubmission, fetchQuestions, fetchCategories } = require('../controllers/SubmissionController');
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

module.exports = router;