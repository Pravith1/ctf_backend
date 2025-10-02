const express = require('express');
const router = express.Router();
const { handleSubmission } = require('../controllers/SubmissionController');
const { verifyToken } = require('../middleware/validate');

// POST /submission - Handle answer submission
router.post('/', verifyToken, handleSubmission);

module.exports = router;