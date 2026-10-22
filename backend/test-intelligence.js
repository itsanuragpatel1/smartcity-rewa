import {
  detectCategory,
  findLocalityAndWard,
  getResponsibleDepartment
} from './services/intelligenceService.js';

console.log('===================================================');
console.log('Running Rewa Connect Intelligence Service Unit Tests');
console.log('===================================================');

let passedTests = 0;
let failedTests = 0;

const assertEqual = (actual, expected, testName) => {
  if (actual === expected) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName} - Expected "${expected}", got "${actual}"`);
    failedTests++;
  }
};

// 1. Test Keyword Categorization
console.log('\n--- Testing Category Auto-Detection ---');
assertEqual(detectCategory('Huge potholes on Sirmour road'), 'Roads & Potholes', 'Road pothole matching');
assertEqual(detectCategory('The street light bulb is fused and dark at night'), 'Street Light', 'Street light matching');
assertEqual(detectCategory('Sanitation garbage dumping pile has bad smell'), 'Garbage', 'Garbage matching');
assertEqual(detectCategory('No drinking water supplied since morning'), 'Water Supply', 'Water supply matching');
assertEqual(detectCategory('Drainage overflow and waterlogged street'), 'Drainage', 'Drainage overflow matching');
assertEqual(detectCategory('Power outage due to transformer sparking'), 'Electricity', 'Electricity matching');
assertEqual(detectCategory('Park benches are broken and wild grass needs cut'), 'Park', 'Park matching');
assertEqual(detectCategory('Encroachment and illegal building structure construction'), 'Illegal Construction', 'Illegal construction matching');
assertEqual(detectCategory('Vandals broke down bus stop shelter benches'), 'Public Property', 'Public property matching');
assertEqual(detectCategory('Some generic random issue report'), 'Other', 'Default fallback category');

// 2. Test Department Mapping
console.log('\n--- Testing Category to Department Mapping ---');
assertEqual(getResponsibleDepartment('Roads & Potholes'), 'PWD', 'Roads to PWD');
assertEqual(getResponsibleDepartment('Garbage'), 'Municipal Sanitation', 'Garbage to sanitation');
assertEqual(getResponsibleDepartment('Water Supply'), 'Water Department', 'Water to water dept');
assertEqual(getResponsibleDepartment('Electricity'), 'Electricity Board', 'Electricity to board');
assertEqual(getResponsibleDepartment('Other'), 'General Administration', 'Default department fallback');

// 3. Test GPS Mapping to Locality & Wards
console.log('\n--- Testing Coordinate-to-Locality & Ward Mapping ---');

// Sirmour Chowk Center is at lat: 24.5385, lng: 81.2982, ward: 12
try {
  const result = findLocalityAndWard(24.5384, 81.2980);
  assertEqual(result.localityName, 'Sirmour Chowk', 'Locality coordinates resolution');
  assertEqual(result.wardNumber, 12, 'Ward number resolution');
} catch (err) {
  console.error('[FAIL] Sirmour Chowk resolution crashed:', err.message);
  failedTests++;
}

// Shilpi Plaza Center is at lat: 24.5332, lng: 81.3005, ward: 15
try {
  const result = findLocalityAndWard(24.5330, 81.3000);
  assertEqual(result.localityName, 'Shilpi Plaza', 'Shilpi Plaza resolution');
  assertEqual(result.wardNumber, 15, 'Shilpi Plaza Ward');
} catch (err) {
  console.error('[FAIL] Shilpi Plaza resolution crashed:', err.message);
  failedTests++;
}

// 4. Test Bounding Box Boundary Rejection
console.log('\n--- Testing Boundary Limits Check ---');
try {
  // New Delhi coordinates: 28.6139, 77.2090
  findLocalityAndWard(28.6139, 77.2090);
  console.error('[FAIL] Boundary Check: Should have rejected New Delhi coordinates');
  failedTests++;
} catch (err) {
  console.log(`[PASS] Boundary Check: Correctly rejected coordinates outside Rewa ("${err.message}")`);
  passedTests++;
}

console.log('\n===================================================');
console.log(`Unit Tests Summary: ${passedTests} passed, ${failedTests} failed`);
console.log('===================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
