# 📝 Question Difficulty System Implementation

## Overview

Questions now require a difficulty level during creation. Admins must specify whether a question is for **"beginner"** or **"intermediate"** difficulty.

## ✅ What Has Been Implemented

### 1. **Question Model Update** (`models/question.js`)

Added `difficulty` field with validation:

```javascript
difficulty: {
  type: String,
  enum: ['beginner', 'intermediate'],  // Only these two values allowed
  required: true
}
```

**Validation:**
- ✅ Required field (cannot be empty)
- ✅ Only accepts "beginner" or "intermediate"
- ✅ Database will reject any other values

### 2. **Create Question Update** (`controllers/adminController.js`)

Updated to require and validate difficulty:

```javascript
const { category, title, description, answer, point, year, difficulty } = req.body;

// Check all required fields
if (!category || !title || !description || !answer || !point || !year || !difficulty) {
  return res.status(400).json({
    message: "All fields are required (category, title, description, answer, point, year, difficulty)"
  });
}

// Validate difficulty
if (!['beginner', 'intermediate'].includes(difficulty)) {
  return res.status(400).json({
    message: "Difficulty must be either 'beginner' or 'intermediate'"
  });
}
```

### 3. **Update Question Enhancement** (`controllers/adminController.js`)

Added difficulty validation when updating questions:

```javascript
// Validate difficulty if provided
if (difficulty && !['beginner', 'intermediate'].includes(difficulty)) {
  return res.status(400).json({
    message: "Difficulty must be either 'beginner' or 'intermediate'"
  });
}
```

### 4. **Swagger Documentation Update**

Updated API documentation:
- ✅ Added difficulty to Question schema
- ✅ Added to create question endpoint
- ✅ Added to update question endpoint
- ✅ Shows enum values (beginner, intermediate)
- ✅ Marked as required for creation

## 📝 API Usage

### Create Question Request (Updated)

```json
POST /admin/questions
{
  "category": "Cryptography",
  "title": "Caesar Cipher Challenge",
  "description": "Decode the following message using Caesar cipher...",
  "answer": "flag{crypto_master}",
  "point": 100,
  "year": 3,
  "difficulty": "beginner"    // NEW REQUIRED FIELD
}
```

### Update Question Request

```json
PATCH /admin/questions/:id
{
  "title": "Updated Title",
  "difficulty": "intermediate",  // Can update difficulty
  "point": 150
}
```

### Question Response Example

```json
{
  "statusCode": 201,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "categoryId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Caesar Cipher Challenge",
    "description": "Decode the following message...",
    "answer": "flag{crypto_master}",
    "point": 100,
    "year": 3,
    "difficulty": "beginner",
    "solved_count": 0,
    "createdAt": "2025-10-09T10:30:00.000Z",
    "updatedAt": "2025-10-09T10:30:00.000Z"
  },
  "message": "Question created"
}
```

## ✨ Validation Rules

### For Create Question:

**Valid values:**
- ✅ `"beginner"`
- ✅ `"intermediate"`

**Invalid values (will return 400 error):**
- ❌ `"easy"`
- ❌ `"hard"`
- ❌ `"advanced"`
- ❌ Empty string
- ❌ Missing field

### For Update Question:

- ✅ Optional field (can update without providing difficulty)
- ✅ If provided, must be "beginner" or "intermediate"

## 🚨 Error Responses

### Missing difficulty in creation:
```json
Status: 400
{
  "statusCode": 400,
  "message": "All fields are required (category, title, description, answer, point, year, difficulty)",
  "success": false
}
```

### Invalid difficulty value:
```json
Status: 400
{
  "statusCode": 400,
  "message": "Difficulty must be either 'beginner' or 'intermediate'",
  "success": false
}
```

## 🎯 Use Cases & Integration

### 1. **Question Filtering by User Difficulty**

You can now filter questions based on user's difficulty level:

```javascript
const fetchQuestions = async (req, res) => {
  const userId = req.user.id;
  const { categoryId } = req.body;
  
  // Get user's difficulty preference
  const user = await User.findById(userId);
  const userDifficulty = user.difficulty; // "beginner" or "intermediate"
  
  // Fetch questions matching both category AND difficulty
  const questions = await Question.find({
    categoryId: categoryId,
    difficulty: userDifficulty,  // Filter by difficulty
    year: user.year
  });
  
  // Return filtered questions
  res.status(200).json({
    success: true,
    data: {
      questions: questions,
      userDifficulty: userDifficulty
    }
  });
};
```

### 2. **Mixed Difficulty Display**

Show both beginner and intermediate questions with labels:

```javascript
// Get all questions for a category
const allQuestions = await Question.find({ categoryId })
  .sort({ difficulty: 1, point: -1 });

// Separate by difficulty
const beginnerQuestions = allQuestions.filter(q => q.difficulty === 'beginner');
const intermediateQuestions = allQuestions.filter(q => q.difficulty === 'intermediate');
```

### 3. **Difficulty-Based Leaderboards**

Create separate leaderboards:

```javascript
// Beginner leaderboard
const beginnerLeaders = await User.find({ 
  field: 'user',
  difficulty: 'beginner'
}).sort({ point: -1 });

// Intermediate leaderboard
const intermediateLeaders = await User.find({ 
  field: 'user',
  difficulty: 'intermediate'
}).sort({ point: -1 });
```

### 4. **Progressive Difficulty**

Allow users to switch difficulty after completing beginner level:

```javascript
// Check if user completed all beginner questions
const beginnerQuestionsCount = await Question.countDocuments({ difficulty: 'beginner' });
const userSolvedBeginner = await Submission.countDocuments({
  user_id: userId,
  iscorrect: true,
  // ... additional query to count only beginner questions
});

if (userSolvedBeginner >= beginnerQuestionsCount) {
  // Allow upgrade to intermediate
  await User.findByIdAndUpdate(userId, { difficulty: 'intermediate' });
}
```

## 📊 Database Structure

### Question Document:
```javascript
{
  _id: ObjectId,
  categoryId: ObjectId,
  title: "Caesar Cipher Challenge",
  description: "Decode the following message...",
  answer: "flag{crypto_master}",
  point: 100,
  year: 3,
  difficulty: "beginner",        // NEW FIELD
  solved_count: 0,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## 🔄 Complete Flow

### Admin Creates Question:
```
Admin Panel
    ↓
Fill Question Details
    ↓
Select Difficulty (beginner/intermediate)
    ↓
POST /admin/questions
    ↓
Validate All Fields
    ↓
Validate Difficulty Enum
    ↓
Create Question in DB
    ↓
Return Success Response
```

### User Views Questions:
```
User Logs In (has difficulty: "beginner")
    ↓
Request Questions for Category
    ↓
Backend Filters by:
  - categoryId
  - year
  - difficulty (beginner)
    ↓
Return Only Beginner Questions
    ↓
User Sees Appropriate Challenges
```

## 🧪 Testing Examples

### Test 1: Create Beginner Question
```bash
POST /admin/questions
Authorization: JWT Cookie

{
  "category": "Web Exploitation",
  "title": "XSS Basic",
  "description": "Find and exploit an XSS vulnerability",
  "answer": "flag{xss_found}",
  "point": 50,
  "year": 2,
  "difficulty": "beginner"
}

Expected: ✅ 201 Created
```

### Test 2: Create Intermediate Question
```bash
{
  "category": "Reverse Engineering",
  "title": "Binary Analysis",
  "description": "Reverse engineer this binary...",
  "answer": "flag{reversed}",
  "point": 200,
  "year": 3,
  "difficulty": "intermediate"
}

Expected: ✅ 201 Created
```

### Test 3: Invalid Difficulty
```bash
{
  "difficulty": "expert"
}

Expected: ❌ 400 Bad Request
{
  "message": "Difficulty must be either 'beginner' or 'intermediate'"
}
```

### Test 4: Missing Difficulty
```bash
{
  // no difficulty field
}

Expected: ❌ 400 Bad Request
{
  "message": "All fields are required (category, title, description, answer, point, year, difficulty)"
}
```

### Test 5: Update Question Difficulty
```bash
PATCH /admin/questions/64f8a1b2c3d4e5f6a7b8c9d0

{
  "difficulty": "intermediate"
}

Expected: ✅ 200 OK
```

## 📈 Benefits

1. **Better User Experience**
   - Beginners get appropriate challenges
   - Intermediate users aren't overwhelmed with easy questions

2. **Fair Competition**
   - Separate leaderboards for different skill levels
   - Users compete with peers at their level

3. **Progressive Learning**
   - Users can start with beginner challenges
   - Graduate to intermediate when ready

4. **Organized Content**
   - Clear categorization of questions
   - Easy to manage difficulty balance

5. **Flexible Deployment**
   - Can show mixed difficulties with labels
   - Or strict filtering based on user level

## 🎓 Summary

✅ **Question Model:** Added difficulty field with enum validation  
✅ **Create Question:** Requires and validates difficulty  
✅ **Update Question:** Validates difficulty if provided  
✅ **Swagger Docs:** Complete documentation with examples  
✅ **Error Handling:** Clear error messages for invalid difficulty  
✅ **Integration Ready:** Can filter questions by user difficulty  

Questions now have difficulty levels matching the user difficulty system! 🎉
