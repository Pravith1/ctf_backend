# 🔐 Authentication Error Messages - User-Friendly Guide

## Overview

The authentication system now provides clear, descriptive error messages for all signup and login scenarios, making it easy for users to understand and fix issues.

## ✅ What Has Been Updated

### 1. **User Model** (`models/User.js`)
- ✅ Added `unique: true` to `team_name` field
- ✅ Prevents duplicate team names in database

### 2. **Signup Controller** (`controllers/authController.js`)
- ✅ Checks for duplicate email before signup
- ✅ Checks for duplicate team name before signup
- ✅ Handles MongoDB duplicate key errors
- ✅ Returns specific error messages for each validation failure
- ✅ Includes success message on successful signup

### 3. **Login Controller** (`controllers/authController.js`)
- ✅ Provides specific error for team name not found
- ✅ Provides specific error for incorrect password
- ✅ Returns user's difficulty level in response
- ✅ Includes success message on successful login

## 📋 Complete Error Messages Reference

### SIGNUP ERRORS

#### 1. Missing Fields
**Status:** `400 Bad Request`
```json
{
  "message": "All fields are required."
}
```
**Triggered when:** Any required field (email, team_name, password, year, difficulty) is missing.

---

#### 2. Invalid Email Domain
**Status:** `400 Bad Request`
```json
{
  "message": "Please use your official PSG Tech email (@psgtech.ac.in)"
}
```
**Triggered when:** Email doesn't end with `@psgtech.ac.in`.

**Examples:**
- ❌ `user@gmail.com`
- ❌ `team@yahoo.com`
- ✅ `team@psgtech.ac.in`

---

#### 3. Invalid Difficulty Level
**Status:** `400 Bad Request`
```json
{
  "message": "Difficulty must be either \"beginner\" or \"intermediate\"."
}
```
**Triggered when:** Difficulty is not "beginner" or "intermediate".

**Examples:**
- ❌ `"advanced"`
- ❌ `"easy"`
- ✅ `"beginner"`
- ✅ `"intermediate"`

---

#### 4. Email Already Registered
**Status:** `409 Conflict`
```json
{
  "message": "Email already registered."
}
```
**Triggered when:** The email is already in the database.

**User Action:** Login instead or use a different email.

---

#### 5. Team Name Already Taken (NEW!)
**Status:** `409 Conflict`
```json
{
  "message": "Team name already taken. Please choose a different team name."
}
```
**Triggered when:** The team name is already in the database.

**User Action:** Choose a different, unique team name.

---

#### 6. Signup Success
**Status:** `201 Created`
```json
{
  "message": "Signup successful!",
  "user": {
    "email": "team@psgtech.ac.in",
    "team_name": "CyberWarriors",
    "year": 3,
    "difficulty": "beginner",
    "field": "user"
  }
}
```

---

#### 7. Server Error
**Status:** `500 Internal Server Error`
```json
{
  "message": "Specific error message from server"
}
```
**Triggered when:** Unexpected server error occurs.

---

### LOGIN ERRORS

#### 1. Missing Fields
**Status:** `400 Bad Request`
```json
{
  "message": "Team name and password are required."
}
```
**Triggered when:** team_name or password is missing.

---

#### 2. Team Name Not Found (NEW!)
**Status:** `401 Unauthorized`
```json
{
  "message": "Team name not found. Please check your team name or sign up."
}
```
**Triggered when:** The team name doesn't exist in the database.

**User Action:** 
- Check spelling of team name
- Or create a new account (signup)

---

#### 3. Incorrect Password (NEW!)
**Status:** `401 Unauthorized`
```json
{
  "message": "Incorrect password. Please try again."
}
```
**Triggered when:** Password doesn't match the stored password.

**User Action:** 
- Check password and try again
- Or use password reset (if implemented)

---

#### 4. Login Success
**Status:** `200 OK`
```json
{
  "message": "Login successful!",
  "user": {
    "email": "team@psgtech.ac.in",
    "team_name": "CyberWarriors",
    "year": 3,
    "difficulty": "beginner",
    "field": "user"
  }
}
```

---

#### 5. Server Error
**Status:** `500 Internal Server Error`
```json
{
  "message": "Specific error message from server"
}
```
**Triggered when:** Unexpected server error occurs.

---

## 🎯 Frontend Implementation Guide

### Displaying Error Messages

```javascript
// Signup
const handleSignup = async (formData) => {
  try {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Display the error message from backend
      showError(data.message);
      return;
    }
    
    // Success! Show success message
    showSuccess(data.message); // "Signup successful!"
    // Redirect or update UI
    
  } catch (error) {
    showError('Network error. Please check your connection.');
  }
};

// Login
const handleLogin = async (formData) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Display the error message from backend
      showError(data.message);
      return;
    }
    
    // Success! Show success message
    showSuccess(data.message); // "Login successful!"
    // Redirect to dashboard
    
  } catch (error) {
    showError('Network error. Please check your connection.');
  }
};
```

### Example Error Display Component (React)

```jsx
const AuthForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message); // Show backend error message
        return;
      }
      
      setSuccess(data.message); // Show backend success message
      
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
};
```

## 📊 Error Handling Flow

### Signup Flow
```
User Submits Signup Form
        ↓
Validate All Fields Present? → No → "All fields are required."
        ↓ Yes
Check Email Domain → Invalid → "Please use your official PSG Tech email"
        ↓ Valid
Check Difficulty → Invalid → "Difficulty must be beginner or intermediate"
        ↓ Valid
Check Email Exists? → Yes → "Email already registered."
        ↓ No
Check Team Name Exists? → Yes → "Team name already taken..."
        ↓ No
Create User → Success → "Signup successful!"
```

### Login Flow
```
User Submits Login Form
        ↓
Validate Fields Present? → No → "Team name and password are required."
        ↓ Yes
Find Team Name → Not Found → "Team name not found..."
        ↓ Found
Verify Password → Wrong → "Incorrect password..."
        ↓ Correct
Generate JWT Token
        ↓
Set Cookie
        ↓
Return Success → "Login successful!"
```

## 🧪 Testing Error Messages

### Test Signup Errors

1. **Missing fields:**
   ```bash
   POST /auth/signup
   { "email": "test@psgtech.ac.in" }
   
   Expected: "All fields are required."
   ```

2. **Invalid email:**
   ```bash
   { "email": "test@gmail.com", ... }
   
   Expected: "Please use your official PSG Tech email (@psgtech.ac.in)"
   ```

3. **Invalid difficulty:**
   ```bash
   { "difficulty": "expert", ... }
   
   Expected: "Difficulty must be either \"beginner\" or \"intermediate\"."
   ```

4. **Duplicate email:**
   ```bash
   { "email": "existing@psgtech.ac.in", ... }
   
   Expected: "Email already registered."
   ```

5. **Duplicate team name:**
   ```bash
   { "team_name": "ExistingTeam", ... }
   
   Expected: "Team name already taken. Please choose a different team name."
   ```

### Test Login Errors

1. **Missing fields:**
   ```bash
   POST /auth/login
   { "team_name": "TestTeam" }
   
   Expected: "Team name and password are required."
   ```

2. **Team not found:**
   ```bash
   { "team_name": "NonExistentTeam", "password": "test123" }
   
   Expected: "Team name not found. Please check your team name or sign up."
   ```

3. **Wrong password:**
   ```bash
   { "team_name": "ExistingTeam", "password": "wrongpassword" }
   
   Expected: "Incorrect password. Please try again."
   ```

## ✨ Benefits

### 1. **User-Friendly**
- Clear, specific error messages
- Users know exactly what went wrong
- Guidance on how to fix the issue

### 2. **Security-Conscious**
- Doesn't reveal whether email exists during login
- Generic "Invalid credentials" for login errors
- Specific messages only for signup to help users

### 3. **Developer-Friendly**
- Consistent error format
- Easy to handle on frontend
- `response.message` always available

### 4. **Complete Coverage**
- All validation scenarios covered
- Both client and server errors handled
- Success messages included

## 📝 Summary

✅ **Team name is now unique** - No duplicate team names allowed  
✅ **Clear error messages** - Users understand what went wrong  
✅ **Specific guidance** - Error messages tell users how to fix issues  
✅ **Success messages** - Positive feedback on successful actions  
✅ **Easy frontend integration** - Just display `response.message`  
✅ **Comprehensive validation** - All edge cases covered  

All authentication errors now provide helpful, user-friendly messages! 🎉
