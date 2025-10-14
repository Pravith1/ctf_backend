const XLSX = require('xlsx');
const path = require('path');

// In-memory cache for registration data
let registrationCache = null;

/**
 * Load and process Excel file - Called once on server startup
 * Stores raw rows for iteration-based lookup
 */
const loadRegistrationData = () => {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'Testing.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON - keep all columns as-is
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    
    registrationCache = jsonData;
    
    console.log(`📊 Loaded ${jsonData.length} registration rows from Excel`);
    return registrationCache;
    
  } catch (error) {
    console.error('❌ Error loading registration data:', error.message);
    throw new Error('Failed to load registration data. Please ensure registrations.xlsx exists in data/ folder.');
  }
};

/**
 * Get difficulty for a roll number by checking Excel data
 * @param {string} email - Email like 23n239@psgtech.ac.in
 * @returns {string} - 'intermediate' or 'beginner'
 */
const getDifficultyFromExcel = (email) => {
  try {
    // Extract roll number from email (remove everything after @)
    const rollNo = email.split('@')[0].trim().toUpperCase();
    
    console.log(`🔍 Looking for roll number: ${rollNo}`);
    
    // Load data if not cached
    if (!registrationCache) {
      loadRegistrationData();
    }
    
    // Iterate through each row
    for (let i = 0; i < registrationCache.length; i++) {
      const row = registrationCache[i];
      
      // Get all "Roll No" columns (Excel may have Roll No, Roll No__1, Roll No__2, etc.)
      const rollNoColumns = Object.keys(row).filter(key => key.startsWith('Roll No'));
      
      // Check if rollNo matches any of the Roll No columns
      for (const column of rollNoColumns) {
        const cellValue = row[column]?.toString().trim().toUpperCase();
        
        if (cellValue === rollNo) {
          console.log(`✅ Found roll number in row ${i + 2}, column: ${column}`);
          
          // Get CTF experience from the same row
          const ctfExperience = row['Do You have previous experience in CTF']?.trim() || '';
          
          console.log(`📝 CTF Experience: "${ctfExperience}"`);
          
          // Check if it's "Yes , I have attented CTF events" (with exact spelling from your form)
          if (ctfExperience.includes('Yes') && ctfExperience.includes('attented')) {
            console.log(`🎯 Assigned difficulty: intermediate`);
            return 'intermediate';
          } else {
            console.log(`🎯 Assigned difficulty: beginner`);
            return 'beginner';
          }
        }
      }
    }
    
    // Roll number not found in any row
    console.log(`❌ Roll number ${rollNo} not found in Excel`);
    throw new Error(`Roll number ${rollNo} is not registered. Please complete registration first.`);
    
  } catch (error) {
    console.error('Error in getDifficultyFromExcel:', error.message);
    throw error;
  }
};

module.exports = {
  loadRegistrationData,
  getDifficultyFromExcel
};
