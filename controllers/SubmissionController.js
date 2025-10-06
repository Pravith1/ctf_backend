const mongoose = require("mongoose");
const Submission = require("../models/submission");
const User = require("../models/user"); // Changed from Team to User
const Question = require("../models/question");
const categoryModel = require("../models/category");
const { emitLeaderboardUpdate, emitNewSolve } = require("./leaderController");

const fetchCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json({
      success: true,
      data: categories,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Categories",
      error: error.message,
    });
  }
};


const fetchQuestions = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const userId = req.user.id;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userYear = user.year;
    const categoryExists = await categoryModel.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let questionsQuery;
    if (userYear === 1 || userYear === 2) {
      questionsQuery = {
        categoryId: categoryId,
        $or: [
          { year: 1 },
          { year: 2 }
        ]
      };
    } else {
      questionsQuery = {
        categoryId: categoryId,
        year: userYear
      };
    }
    const questions = await Question.find(questionsQuery)
      .populate('categoryId', 'name')
      .select('title description point year solved_count createdAt answer')
      .sort({ year: 1, point: -1 });

    res.status(200).json({
      success: true,
      data: {
        questions: questions,
        category: categoryExists.name,
        userYear: userYear,
        totalQuestions: questions.length
      },
      message: "Questions fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
}

const handleSubmission = async (req, res) => {
  const { question_id, submitted_answer } = req.body;
  const userId = req.user.id; // From JWT token

  if (!question_id || !submitted_answer) {
    return res
      .status(400)
      .json({ message: "Question ID and submission answer are required." });
  }

  const session = await mongoose.startSession();

  try {
    let resultMessage = "";
    let isCorrect = false;
    let pointsAwarded = 0;
    let totalScore = 0;

    await session.withTransaction(async () => {
      // Get user information from JWT token
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error("User not found.");
      }

      // Get question information
      const question = await Question.findById(question_id).session(session);
      if (!question) {
        throw new Error("Question not found.");
      }

      // --- VALIDATION CHECKS ---

      // 1. Check for an existing correct submission for this question by this user
      const existingCorrectSubmission = await Submission.findOne({
        user_id: user._id, // Changed from team_id to user_id
        question_id: question._id,
        iscorrect: true,
      }).session(session);

      if (existingCorrectSubmission) {
        throw new Error("You have already solved this question.");
      }

      // 2. Check if the submitted answer is correct
      if (question.answer !== submitted_answer) {
        // Log the incorrect attempt
        const incorrectLog = new Submission({
          user_id: user._id,
          question_id: question._id,
          iscorrect: false,
          submitted_at: new Date(),
        });
        await incorrectLog.save({ session });

        isCorrect = false;
        totalScore = user.point;
        resultMessage = "Incorrect answer. Try again!";
      } else {
        // --- UPDATES (if answer is correct and not previously solved) ---
        pointsAwarded = question.point;
        isCorrect = true;

        // Update the user's score and last submission timestamp
        user.point += pointsAwarded;
        user.lastSubmissionAt = new Date();

        // Dynamically reduce the question's points
        const newPoints = Math.floor(question.point * 0.95);
        question.point = newPoints;

        // Log the new, correct submission
        const correctLog = new Submission({
          user_id: user._id,
          question_id: question._id,
          iscorrect: true,
          submitted_answer: submitted_answer,
          submitted_at: new Date(),
        });

        // Save all updated documents within the transaction
        await user.save({ session });
        await question.save({ session });
        await correctLog.save({ session });

        totalScore = user.point;
        resultMessage = `Correct! You earned ${pointsAwarded} points.`;
      }
    });

    // 🚀 REAL-TIME LEADERBOARD UPDATE!
    if (isCorrect) {
      // Emit real-time leaderboard update to all clients
      setTimeout(() => {
        emitLeaderboardUpdate(userId);
        emitNewSolve(userId, question.title, pointsAwarded);
      }, 100); // Small delay to ensure database updates are complete
    }

    res.status(200).json({
      message: resultMessage,
      isCorrect: isCorrect,
      pointsAwarded: pointsAwarded,
      totalScore: totalScore,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  } finally {
    await session.endSession();
  }
};

module.exports = { handleSubmission,fetchQuestions,fetchCategories};
