const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderController');
const {verifyToken} = require('../middleware/validate');

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get current leaderboard rankings
 *     tags: [Leaderboard]
 *     description: Returns all users ranked by points, solved count, and registration time
 *     responses:
 *       200:
 *         description: Leaderboard fetched successfully
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
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: number
 *                         example: 1
 *                       team_name:
 *                         type: string
 *                         example: CyberWarriors
 *                       points:
 *                         type: number
 *                         example: 450
 *                       solved_count:
 *                         type: number
 *                         example: 12
 *                       user_id:
 *                         type: string
 *                         example: 64f8a1b2c3d4e5f6a7b8c9d0
 *                 message:
 *                   type: string
 *                   example: Leaderboard fetched successfully
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', verifyToken, getLeaderboard);

module.exports = router;