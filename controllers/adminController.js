const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const Category = require('../models/category');
const Question = require('../models/question');
const User = require('../models/user');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find({ difficulty: userDifficulty });
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched"));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, difficulty } = req.body;
  if (!name) {
    return res.status(400).json(new ApiResponse(400, null, "Category name required"));
  }

  if (!difficulty) {
    return res.status(400).json(new ApiResponse(400, null, "Category difficulty required"));
  }

  if (!['beginner', 'intermediate'].includes(difficulty)) {
    return res.status(400).json(new ApiResponse(400, null, "Difficulty must be either 'beginner' or 'intermediate'"));
  }

  let category = await Category.findOne({ name: name.trim() });
  if (category) {
    return res.status(400).json(new ApiResponse(400, null, "Category already exists"));
  }

  category = await Category.create({ name: name.trim(), difficulty });
  res.status(201).json(new ApiResponse(201, category, "Category created"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, difficulty } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json(new ApiResponse(400, null, "Category name required"));
  }

  if (difficulty && !['beginner', 'intermediate'].includes(difficulty)) {
    return res.status(400).json(new ApiResponse(400, null, "Difficulty must be either 'beginner' or 'intermediate'"));
  }

  const normalizedName = name.trim();

  const duplicate = await Category.findOne({
    name: normalizedName,
    _id: { $ne: id }
  });

  if (duplicate) {
    return res.status(400).json(new ApiResponse(400, null, "Category already exists"));
  }

  const updateData = { name: normalizedName };
  if (difficulty) {
    updateData.difficulty = difficulty;
  }

  const category = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!category) {
    return res.status(404).json(new ApiResponse(404, null, "Category not found"));
  }

  res.status(200).json(new ApiResponse(200, category, "Category updated"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hasQuestions = await Question.exists({ categoryId: id });
  if (hasQuestions) {
    return res.status(400).json(new ApiResponse(400, null, "Cannot delete category with existing questions"));
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json(new ApiResponse(404, null, "Category not found"));
  }

  res.status(200).json(new ApiResponse(200, category, "Category deleted"));
});

const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find()
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, questions, "Questions fetched"));
});

const createQuestion = asyncHandler(async (req, res) => {
  const { category, title, description, hint, answer, point, year, difficulty } = req.body;

  if (!category || !title || !description || !answer || !point || !year || !difficulty) {
    return res.status(400).json({
      statusCode: 400,
      message: "All fields are required (category, title, description, answer, point, year, difficulty)",
      success: false
    });
  }

  // Validate difficulty
  if (!['beginner', 'intermediate'].includes(difficulty)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Difficulty must be either 'beginner' or 'intermediate'",
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
  const { category, difficulty } = req.body;

  let updateData = { ...req.body };

  // Validate difficulty if provided
  if (difficulty && !['beginner', 'intermediate'].includes(difficulty)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Difficulty must be either 'beginner' or 'intermediate'",
      success: false
    });
  }

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

const isAdmin = (req, res) => {
  res.status(200).json({ flag: true });
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  isAdmin,
};
