const moment = require('moment');

// Get the start and end of a specific year
function getYearRange(yearsBack = 0) {
  const start = moment().subtract(yearsBack, 'years').startOf('year'); // Start of the year
  const end = moment().subtract(yearsBack, 'years').endOf('year');     // End of the year
  return { start, end };
}

// Specific year cases
function getCurrentYear() {
  return getYearRange(0); // Current year
}

function getLastYear() {
  return getYearRange(1); // Last year
}

module.exports = {
  getYearRange,
  getCurrentYear,
  getLastYear,
};
