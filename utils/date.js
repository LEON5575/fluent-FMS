const moment = require('moment');

function getCustomDateRange(fromDate, toDate) {
  const start = moment(fromDate).startOf('day');  // Make sure we're using the start of the day
  const end = moment(toDate).endOf('day');      // Ensure we get until the end of the day
  return { start, end };
}

function getLastNDays(n) {
  const now = moment();
  const start = now.subtract(n, 'days').startOf('day');  // Start of the N days ago
  const end = now.endOf('day'); // Until the end of today
  return { start, end };
}

module.exports = {
  getCustomDateRange,
  getLastNDays,
};
