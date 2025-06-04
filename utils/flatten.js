// utils/flatten.js

// Utility to flatten a nested object to a flat key-value pair
function flattenSubmission(obj, prefix = '') {
  let result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      // If value is an object, recursively flatten it
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, flattenSubmission(value, newKey));  // Recursive call for nested objects
      } else {
        result[newKey] = value;  // Base case: add to result
      }
    }
  }

  return result;
}

module.exports = { flattenSubmission };
