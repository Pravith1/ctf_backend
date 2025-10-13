const XLSX = require('xlsx');
const path = require('path');

// In-memory cache for registration data
let registrationCache = null;

/**
 * Load and process Excel file - Called once on server startup
 */
const loadRegistrationData = () => {
  try {
    // Load Excel file
    const excelPath = path.join(__dirname, '../data/registrations.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    // Process and normalize data
    registrationCache = rawData.map(row => {
      // Extract roll numbers (handle empty cells)
      const rollNo1 = (row['Roll No'] || '').toString().trim().toUpperCase();
      const rollNo2 = (row['Roll No__1'] || '').toString().trim().toUpperCase();
      const rollNo3 = (row['Roll No__2'] || '').toString().trim().toUpperCase();
      
      // Extract year (convert Roman to number or use as-is)
      const year1 = convertYearToNumber(row['Year'] || '');
      const year2 = convertYearToNumber(row['Year__1'] || '');
      const year3 = convertYearToNumber(row['Year__2'] || '');
      
      // Extract CTF experience
      const ctfExperience = (row['Do You have previous experience in CTF'] || '').toString().trim();
      
      return {
        member1: { rollNo: rollNo1, year: year1 },
        member2: { rollNo: rollNo2, year: year2 },
        member3: { rollNo: rollNo3, year: year3 },
        ctfExperience: ctfExperience,
        timestamp: row['Timestamp']
      };
    });
    
    console.log(`✅ Registration data loaded: ${registrationCache.length} teams registered`);
    return true;
  } catch (error) {
    console.error('❌ Error loading registration data:', error.message);
    console.error('Make sure registrations.xlsx exists in /data folder');
    registrationCache = [];
    return false;
  }
};

/**
 * Convert year string to number (handles Roman numerals and numbers)
 */
const convertYearToNumber = (yearStr) => {
  const year = yearStr.toString().trim().toUpperCase();
  
  // Roman numerals
  const romanMap = {
    'I': 1,
    'II': 2,
    'III': 3,
    'IV': 4
  };
  
  if (romanMap[year]) {
    return romanMap[year];
  }
  
  // If already a number
  const numYear = parseInt(year);
  if (!isNaN(numYear) && numYear >= 1 && numYear <= 4) {
    return numYear;
  }
  
  return null;
};

/**
 * Search for roll number in registration data
 * Returns: { found: boolean, year: number, ctfExperience: string }
 */
const findRegistration = (rollNo) => {
  if (!registrationCache || registrationCache.length === 0) {
    throw new Error('Registration data not loaded');
  }
  
  // Normalize roll number
  const searchRollNo = rollNo.toString().trim().toUpperCase();
  
  // Search through all teams
  for (const team of registrationCache) {
    // Check all three member slots
    if (team.member1.rollNo === searchRollNo && team.member1.year) {
      return {
        found: true,
        year: team.member1.year,
        ctfExperience: team.ctfExperience
      };
    }
    
    if (team.member2.rollNo === searchRollNo && team.member2.year) {
      return {
        found: true,
        year: team.member2.year,
        ctfExperience: team.ctfExperience
      };
    }
    
    if (team.member3.rollNo === searchRollNo && team.member3.year) {
      return {
        found: true,
        year: team.member3.year,
        ctfExperience: team.ctfExperience
      };
    }
  }
  
  // Not found
  return { found: false, year: null, ctfExperience: null };
};

/**
 * Determine difficulty based on year and CTF experience
 */
const determineDifficulty = (year, ctfExperience) => {
  // Year 1: Always beginner
  if (year === 1) {
    return 'beginner';
  }
  
  // Year 3 or 4: Always intermediate
  if (year === 3 || year === 4) {
    return 'intermediate';
  }
  
  // Year 2: Check CTF experience
  if (year === 2) {
    const hasExperience = ctfExperience.toLowerCase().includes('yes');
    return hasExperience ? 'intermediate' : 'beginner';
  }
  
  // Default fallback
  return 'beginner';
};

/**
 * Main function: Validate and get difficulty for a user
 */
const validateAndGetDifficulty = (email, userEnteredYear) => {
  // Extract roll number from email
  const rollNo = email.split('@')[0].toUpperCase();
  
  // Find in registration data
  const registration = findRegistration(rollNo);
  
  if (!registration.found) {
    return {
      valid: false,
      error: 'You are not registered. Please complete registration first.',
      difficulty: null
    };
  }
  
  // Verify year matches (optional - can be removed if not needed)
  // This ensures user enters correct year
  if (registration.year !== userEnteredYear) {
    return {
      valid: false,
      error: `Year mismatch. Your registered year is ${registration.year}.`,
      difficulty: null
    };
  }
  
  // Determine difficulty
  const difficulty = determineDifficulty(registration.year, registration.ctfExperience);
  
  return {
    valid: true,
    error: null,
    difficulty: difficulty,
    year: registration.year
  };
};

module.exports = {
  loadRegistrationData,
  validateAndGetDifficulty,
  findRegistration
};
