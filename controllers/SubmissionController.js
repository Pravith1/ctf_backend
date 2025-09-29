const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const User = require('../models/User'); // Changed from Team to User
const Question = require('../models/question');

const handleSubmission = async (req, res) => {
  const { question_id, submitted_answer } = req.body;
  const userId = req.user.id; // From JWT token

  if (!question_id || !submitted_answer) {
    return res.status(400).json({ message: 'Question ID and submission answer are required.' });
  }

  const session = await mongoose.startSession();

  try {
    let resultMessage = '';
    let isCorrect = false;
    let pointsAwarded = 0;
    let totalScore = 0;
    
    await session.withTransaction(async () => {
      // Get user information from JWT token
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found.');
      }

      // Get question information
      const question = await Question.findById(question_id).session(session);
      if (!question) {
        throw new Error('Question not found.');
      }

      // --- VALIDATION CHECKS ---

      // 1. Check for an existing correct submission for this question by this user
      const existingCorrectSubmission = await Submission.findOne({
        user_id: user._id, // Changed from team_id to user_id
        question_id: question._id,
        iscorrect: true
      }).session(session);

      if (existingCorrectSubmission) {
        throw new Error('You have already solved this question.');
      }

      // 2. Check if the submitted answer is correct
      if (question.correct_answer !== submitted_answer) {
        // Log the incorrect attempt
        const incorrectLog = new Submission({
          user_id: user._id,
          question_id: question._id,
          iscorrect: false,
          submitted_at: new Date()
        });
        await incorrectLog.save({ session });
        
        isCorrect = false;
        totalScore = user.points;
        resultMessage = 'Incorrect answer. Try again!';
      } else {
        // --- UPDATES (if answer is correct and not previously solved) ---
        pointsAwarded = question.points;
        isCorrect = true;

        // Update the user's score and last submission timestamp
        user.points += pointsAwarded;
        user.lastSubmissionAt = new Date();

        // Dynamically reduce the question's points
        const newPoints = Math.floor(question.points * 0.95);
        question.points = newPoints;
        
        // Log the new, correct submission
        const correctLog = new Submission({
          user_id: user._id,
          question_id: question._id,
          iscorrect: true,
          submitted_answer: submitted_answer,
          submitted_at: new Date()
        });
        
        // Save all updated documents within the transaction
        await user.save({ session });
        await question.save({ session });
        await correctLog.save({ session });
        
        totalScore = user.points;
        resultMessage = `Correct! You earned ${pointsAwarded} points.`;
      }
    });
    
    res.status(200).json({ 
      message: resultMessage,
      isCorrect: isCorrect,
      pointsAwarded: pointsAwarded,
      totalScore: totalScore,
      success: true 
    });

  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      success: false 
    });
  } finally {
    await session.endSession();
  }
};

module.exports = { handleSubmission };