# 🎯 Difficulty Level System Implementation

## Overview

The CTF backend now supports two difficulty levels: **beginner** and **intermediate**. Users must select their difficulty level during signup.

## ✅ What Has Been Implemented

### 1. **User Model Update** (`models/User.js`)

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

### 2. **Signup Controller Update** (`controllers/authController.js`)

Updated to accept and validate difficulty:

```javascript
const { email, team_name, password, year, difficulty } = req.body;

// Validation
if (!email || !team_name || !password || !year || !difficulty) {
  return res.status(400).json({ message: 'All fields are required.' });
}

// Difficulty validation
if (!['beginner', 'intermediate'].includes(difficulty)) {
  return res.status(400).json({ 
    message: 'Difficulty must be either "beginner" or "intermediate".' 
  });
}
```

**Features:**
- ✅ Requires difficulty in signup request
- ✅ Validates difficulty is either "beginner" or "intermediate"
- ✅ Returns clear error message for invalid values
- ✅ Stores difficulty in database
- ✅ Returns difficulty in signup response

### 3. **Swagger Documentation Update**

Updated API documentation to include difficulty:

- ✅ Added to User schema
- ✅ Added to signup endpoint documentation
- ✅ Marked as required field
- ✅ Shows enum values (beginner, intermediate)

## 📝 API Usage

### Signup Request (Updated)

```json
POST /auth/signup
{
  "email": "team@psgtech.ac.in",
  "team_name": "CyberWarriors",
  "password": "SecurePass123!",
  "year": 3,
  "difficulty": "beginner"
}
```

### Signup Response

```json
{
  "user": {
    "email": "team@psgtech.ac.in",
    "team_name": "CyberWarriors",
    "year": 3,
    "difficulty": "beginner",
    "field": "user"
  }
}
```

### Error Responses

**Missing difficulty:**
```json
Status: 400
{
  "message": "All fields are required."
}
```

**Invalid difficulty:**
```json
Status: 400
{
  "message": "Difficulty must be either \"beginner\" or \"intermediate\"."
}
```

## 🎮 How It Works

### Registration Flow

```
User Submits Signup Form
        ↓
Validate All Fields Present
        ↓
Check Email Domain (@psgtech.ac.in)
        ↓
Validate Difficulty (beginner/intermediate)
        ↓
Check Email Not Already Registered
        ↓
Create User with Difficulty Level
        ↓
Return Success Response
```

### Future Use Cases

The difficulty field can be used for:

1. **Question Filtering**
   - Show beginner questions to beginner users
   - Show intermediate questions to intermediate users
   - Or show both with difficulty indicators

2. **Separate Leaderboards**
   - Beginner leaderboard
   - Intermediate leaderboard
   - Combined leaderboard

3. **Point Scaling**
   - Different point values based on difficulty
   - Bonus points for intermediate users solving beginner questions

4. **Challenge Recommendations**
   - Suggest appropriate challenges based on difficulty level

## 🔧 Example Implementation for Question Filtering

You could update `fetchQuestions` to filter by difficulty:

```javascript
const fetchQuestions = async (req, res) => {
  const { categoryId } = req.body;
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  const userDifficulty = user.difficulty; // "beginner" or "intermediate"
  
  // Fetch questions matching user's difficulty level
  const questions = await Question.find({
    categoryId: categoryId,
    difficulty: userDifficulty
  });
  
  // ... rest of the code
};
```

## 📊 Database Structure

```
User Document:
{
  _id: ObjectId,
  email: "team@psgtech.ac.in",
  team_name: "CyberWarriors",
  password: "hashed_password",
  year: 3,
  difficulty: "beginner",        // NEW FIELD
  point: 0,
  solved_no: 0,
  field: "user",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## ✨ Testing

### Test Cases

1. **Valid beginner signup:**
   ```bash
   POST /auth/signup
   {
     "email": "test@psgtech.ac.in",
     "team_name": "TestTeam",
     "password": "Test123!",
     "year": 2,
     "difficulty": "beginner"
   }
   ```
   Expected: ✅ 201 Created

2. **Valid intermediate signup:**
   ```bash
   {
     "difficulty": "intermediate"
   }
   ```
   Expected: ✅ 201 Created

3. **Invalid difficulty:**
   ```bash
   {
     "difficulty": "advanced"
   }
   ```
   Expected: ❌ 400 Bad Request

4. **Missing difficulty:**
   ```bash
   {
     // no difficulty field
   }
   ```
   Expected: ❌ 400 Bad Request

5. **Empty difficulty:**
   ```bash
   {
     "difficulty": ""
   }
   ```
   Expected: ❌ 400 Bad Request

## 🎯 Summary

✅ **User Model:** Added difficulty field with enum validation  
✅ **Signup API:** Requires and validates difficulty  
✅ **Error Handling:** Clear error messages for invalid difficulty  
✅ **Swagger Docs:** Complete documentation with examples  
✅ **Response:** Returns difficulty in signup response  

Users must now choose between **"beginner"** or **"intermediate"** when signing up!
