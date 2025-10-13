// Test script to verify Excel reading
const { getDifficultyFromExcel, loadRegistrationData } = require('./utils/registrationService');

console.log('=== Testing Excel Registration Service ===\n');

try {
  // Load the data
  console.log('1. Loading registration data...');
  loadRegistrationData();
  console.log('✅ Data loaded successfully\n');
  
  // Test cases
  const testEmails = [
    '23n239@psgtech.ac.in',
    '23n240@psgtech.ac.in',
    '23n241@psgtech.ac.in',
    'INVALID@psgtech.ac.in'
  ];
  
  console.log('2. Testing difficulty assignment:\n');
  
  testEmails.forEach(email => {
    console.log(`Testing email: ${email}`);
    try {
      const difficulty = getDifficultyFromExcel(email);
      console.log(`✅ Result: ${difficulty}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('---\n');
  });
  
} catch (error) {
  console.error('❌ Fatal error:', error.message);
}
