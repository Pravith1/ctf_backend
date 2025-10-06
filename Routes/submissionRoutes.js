const express = require('express');
const router = express.Router();
const { handleSubmission, fetchQuestions, fetchCategories } = require('../controllers/SubmissionController');
const { verifyToken } = require('../middleware/validate');

// POST /submission - Handle answer submission
router.post('/', verifyToken, handleSubmission);

// POST /submission/questions - Fetch questions by category (combines year 1 and 2)
router.post('/questions', verifyToken, fetchQuestions);

// GET /submission/categories - Fetch all categories
router.get('/categories', verifyToken, fetchCategories);

module.exports = router;