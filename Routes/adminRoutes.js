const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// middleware provided for authentication and admin check
const { isAdmin } = require('../middleware/auth');
const {verifyToken} = require('../middleware/validate');

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories (Admin only)
 *     tags: [Admin]
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
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Categories fetched
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not an admin
 */
router.get('/categories', verifyToken, isAdmin, adminController.getCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cryptography
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Category created
 *       400:
 *         description: Category name required or already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 */
router.post('/categories', verifyToken, isAdmin, adminController.createCategory);

/**
 * @swagger
 * /admin/questions:
 *   get:
 *     summary: Get all questions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *                 message:
 *                   type: string
 *                   example: Questions fetched
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 */
router.get('/questions', verifyToken, isAdmin, adminController.getQuestions);

/**
 * @swagger
 * /admin/questions:
 *   post:
 *     summary: Create a new question (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - title
 *               - description
 *               - answer
 *               - point
 *               - year
 *             properties:
 *               category:
 *                 type: string
 *                 example: Cryptography
 *               title:
 *                 type: string
 *                 example: Caesar Cipher Challenge
 *               description:
 *                 type: string
 *                 example: Decode the following message...
 *               answer:
 *                 type: string
 *                 example: flag{crypto_master}
 *               point:
 *                 type: number
 *                 example: 100
 *               year:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *                 message:
 *                   type: string
 *                   example: Question created
 *       400:
 *         description: Missing required fields or question already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 */
router.post('/questions', verifyToken, isAdmin, adminController.createQuestion);

/**
 * @swagger
 * /admin/questions/{id}:
 *   patch:
 *     summary: Update a question (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               answer:
 *                 type: string
 *               point:
 *                 type: number
 *               year:
 *                 type: number
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *                 message:
 *                   type: string
 *                   example: Question updated
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 */
router.patch('/questions/:id', verifyToken, isAdmin, adminController.updateQuestion);

/**
 * @swagger
 * /admin/questions/{id}:
 *   delete:
 *     summary: Delete a question (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *                 message:
 *                   type: string
 *                   example: Question deleted
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an admin
 */
router.delete('/questions/:id', verifyToken, isAdmin, adminController.deleteQuestion);

module.exports = router;
