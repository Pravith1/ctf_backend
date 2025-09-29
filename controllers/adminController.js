const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const Category = require('../models/category');
const Question = require('../models/question');
const User = require('../models/User');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched"));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json(new ApiResponse(400, null, "Category name required"));
  }

  let category = await Category.findOne({ name: name.trim() });
  if (category) {
    return res.status(400).json(new ApiResponse(400, null, "Category already exists"));
  }

  category = await Category.create({ name: name.trim() });
  res.status(201).json(new ApiResponse(201, category, "Category created"));
});

const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find()
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, questions, "Questions fetched"));
});

const createQuestion = asyncHandler(async (req, res) => {
  const { category, title, description, answer, point, year } = req.body;

  if (!category || !title || !description || !answer || !point || !year) {
    return res.status(400).json({
      statusCode: 400,
      message: "All fields are required",
      success: false
    });
  }
  let cat = await Category.findOne({ name: category });
  if (!cat) cat = await Category.create({ name: category });

  const existing = await Question.findOne({ title, categoryId: cat._id });
  if (existing) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Question already exists in this category"));
  }

  const question = await Question.create({
    ...req.body,
    categoryId: cat._id
  });

  res.status(201).json(new ApiResponse(201, question, "Question created"));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  let updateData = { ...req.body };

  if (category) {
    let cat = await Category.findOne({ name: category });
    if (!cat) cat = await Category.create({ name: category });
    updateData.categoryId = cat._id;
  }

  const question = await Question.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!question) {
    return res.status(404).json(new ApiResponse(404, null, "Question not found"));
  }
  res.status(200).json(new ApiResponse(200, question, "Question updated"));
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Question.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json(new ApiResponse(404, null, "Question not found"));
  }

  res.status(200).json(new ApiResponse(200, deleted, "Question deleted"));
});

module.exports = {
  getCategories,
  createCategory,

  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
