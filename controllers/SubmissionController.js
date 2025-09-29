const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Team = require('../models/Team'); // Needed for updating team score
const Question = require('../models/Question'); // Needed for updating question points

const handleSubmission = async (req, res) => {
  // Assuming a middleware has already validated and attached 'team' and 'question'
  const { team, question } = req;
  const { submitted_answer } = req.body;

  if (!submitted_answer) {
    return res.status(400).json({ message: 'Submission answer is required.' });
  }

  const session = await mongoose.startSession();

  try {
    let resultMessage = '';
    
    await session.withTransaction(async () => {
      // --- VALIDATION CHECKS ---

      // 1. Check for an existing correct submission for this question by this team.
      const existingCorrectSubmission = await Submission.findOne({
        team_id: team._id,
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
          team_id: team._id,
          question_id: question._id,
          iscorrect: false,
          submitted_answer: submitted_answer,
        });
        await incorrectLog.save({ session });
        throw new Error('Incorrect answer.');
      }

      // --- UPDATES (if answer is correct and not previously solved) ---
      const pointsAwarded = question.points;

      // Update the team's score and last submission timestamp
      team.point += pointsAwarded;
      team.lastSubmissionAt = new Date();

      // Dynamically reduce the question's points
      const newPoints = Math.max(50, Math.floor(question.points * 0.95)); // Example logic
      question.point = newPoints;
      
      // Log the new, correct submission
      const correctLog = new Submission({
        team_id: team._id,
        question_id: question._id,
        iscorrect: true,
        submitted_answer: submitted_answer,
      });
      
      // Save all updated documents within the transaction
      await team.save({ session });
      await question.save({ session });
      await correctLog.save({ session });
      
      resultMessage = `Correct! You earned ${pointsAwarded} points.`;
    });
    
    res.status(200).json({ message: resultMessage });

  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    await session.endSession();
  }
};

module.exports = { handleSubmission };