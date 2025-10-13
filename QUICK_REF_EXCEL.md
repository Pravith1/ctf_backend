# 🎯 Quick Reference - Registration Excel Lookup

## How It Works

```javascript
// Input
email: "23n239@psgtech.ac.in"

// Step 1: Extract roll number
rollNo = "23n239" → "23N239" (uppercase)

// Step 2: Search Excel rows
for each row in Excel:
  for each column starting with "Roll No":
    if column value === "23N239":
      ctfExperience = row["Do You have previous experience in CTF"]
      
      if ctfExperience contains "Yes" AND "attented":
        return "intermediate"
      else:
        return "beginner"

// Step 3: Not found
throw Error("Roll number 23N239 is not registered")
```

## Excel Column Names

```
Roll No          ← First member
Roll No__1       ← Second member (Excel auto-renames)
Roll No__2       ← Third member (Excel auto-renames)
```

## CTF Experience Values

✅ **Intermediate**: `"Yes , I have attented CTF events"`
❌ **Beginner**: Any other value (No, empty, etc.)

## Test Commands

```bash
# Install package
npm install xlsx

# Create data folder
mkdir data

# Place Excel file
# Copy your registrations.xlsx to data/registrations.xlsx

# Test the service
node test-excel.js

# Start server
npm start
```

## Signup Request (No difficulty field needed!)

```json
POST /auth/signup
{
  "email": "23n239@psgtech.ac.in",
  "team_name": "CyberWarriors",
  "password": "SecurePass123",
  "year": 3
}
```

## Response

```json
{
  "message": "Signup successful!",
  "token": "eyJ...",
  "user": {
    "difficulty": "intermediate"  ← Auto-assigned!
  }
}
```

Done! 🚀
