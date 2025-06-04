const moment = require('moment');

// For the current or previous month
function getMonth(monthsBack = 1) {
  const start = moment().subtract(monthsBack, 'months').startOf('month'); // Start of the month
  const end = moment().subtract(monthsBack, 'months').endOf('month');     // End of the month
  return { start, end };
}

// More specific cases
function getLast3Months() {
  return getMonth(3);
}

function getLast6Months() {
  return getMonth(6);
}

function getLast12Months() {
  return getMonth(12);
}

module.exports = {
  getMonth,
  getLast3Months,
  getLast6Months,
  getLast12Months,
};
