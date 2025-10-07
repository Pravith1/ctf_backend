const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// middleware provided for authentication and admin check
const { isAdmin } = require('../middleware/auth');
const {verifyToken} = require('../middleware/validate');

router.get('/categories', verifyToken, isAdmin, adminController.getCategories);
router.post('/categories', verifyToken, isAdmin, adminController.createCategory);


router.get('/questions', verifyToken, isAdmin, adminController.getQuestions);
router.post('/questions', verifyToken, isAdmin, adminController.createQuestion);
router.patch('/questions/:id', verifyToken, isAdmin, adminController.updateQuestion);
router.delete('/questions/:id', verifyToken, isAdmin, adminController.deleteQuestion);

module.exports = router;
