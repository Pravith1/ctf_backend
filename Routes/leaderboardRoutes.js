const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderController');

// GET /api/leaderboard - Get current leaderboard
router.get('/', getLeaderboard);

module.exports = router;