const Project = require("../models/Project");
const Form = require("../models/Form");
const FormSubmission = require("../models/formSubmission");
const Dashboard = require("../models/dashboard");
const Pagination = require("../utils/pagination");
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const ExcelJS = require("exceljs");
let moment = require('moment');
// utils
const {
  getMonth,
  getLast3Months,
  getLast6Months,
  getLast12Months,
} = require("../utils/month");
const { getCurrentYear, getLastYear } = require("../utils/year");
const { getCustomDateRange } = require("../utils/date");
// helper
function getDateRangeFromQuery(query) {
  let { filterType, fromDate, toDate } = query;
  let start, end;

  // Log the incoming query parameters for debugging
  console.log('Incoming Query:', query);

  // If no filterType is provided, return a wide date range (all data)
  if (!filterType) {
    console.log('No filterType provided, returning all data (from start to today)');
    start = new Date(0); // Start of time (January 1st, 1970)
    end = new Date(); // Current date
  } else {
    switch (filterType) {
      case "month":
        ({ start, end } = getMonth(1));
        break;
      case "last3Months":
        ({ start, end } = getLast3Months());
        break;
      case "last6Months":
        ({ start, end } = getLast6Months());
        break;
      case "last12Months":
        ({ start, end } = getLast12Months());
        break;
      case "currentYear":
        ({ start, end } = getCurrentYear());
        break;
      case "lastYear":
        ({ start, end } = getLastYear());
        break;
      case "range":
        if (fromDate && toDate) {
          console.log('fromDate:', fromDate, 'toDate:', toDate);
          
          // Manually adjust toDate if it's invalid (e.g., June 31st becomes June 30th)
          const toMoment = moment(toDate);
          if (!toMoment.isValid()) {
            console.error("Invalid toDate detected:", toDate);
            // Adjust to the last valid day of the month
            toMoment.endOf('month');
          }
          ({ start, end } = getCustomDateRange(fromDate, toMoment.format('YYYY-MM-DD')));
        } else {
          throw new Error("Missing fromDate or toDate for custom range.");
        }
        break;
      default:
        ({ start, end } = getMonth(1)); // Default to last month
    }
  }
  // Parse the start and end dates using Moment.js
  start = moment(start);
  end = moment(end);
  // Log the parsed dates for debugging
  console.log('Parsed Start Date:', start.format(), 'Parsed End Date:', end.format());
  // Ensure that the dates are valid
  if (!start.isValid() || !end.isValid()) {
    throw new Error("Invalid date range");
  }
  //Convert moment objects to JavaScript Date objects
  start = start.toDate();
  end = end.toDate();
  // Return the start and end date
  return { start, end };
}

//^ Export project submissions as CSV
exports.exportCSV = async (req, res) => {
  try {
    const { clientId } = req.params;
    const submissions = await FormSubmission.find({ clientId });

    if (!submissions.length) {
      return res.json({ message: "No submissions found" });
    }

    const filePath = path.join(__dirname, "../exports/submission.csv");
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: Object.keys(submissions[0].toObject()).map((key) => ({
        id: key,
        title: key,
      })),
    });

    await csvWriter.writeRecords(
      submissions.map((item) => {
        let obj = item.toObject();
        if (obj.submissionData && typeof obj.submissionData === "object") {
          obj.submissionData = JSON.stringify(obj.submissionData);
        }
        return obj;
      })
    );
    res.download(filePath, "submissions.csv", (err) => {
      if (err) res.json({ message: "Error sending file", error: err.message });
      fs.unlink(filePath, () => {}); // Delete file after download
    });
  } catch (error) {
    res.json({ message: "Error exporting CSV", error: error.message });
  }
};

//^ Export project submissions as Excel
exports.exportExcel = async (req, res) => {
  try {
    const { clientId } = req.params;
    const submissions = await FormSubmission.find({ clientId });

    if (!submissions.length) {
      return res.status(404).json({ message: "No submissions found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Submissions");

    // Add columns dynamically from submission fields
    const columns = Object.keys(submissions[0].toObject()).map((key) => ({
      header: key,
      key: key,
    }));

    worksheet.columns = columns;
    submissions.forEach((submission) => {
      worksheet.addRow(submission.toObject());
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=submissions.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting Excel", error: error.message });
  }
};

//^ Get all projects for a client (monthly + paginated)
exports.getProjects = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page, limit, skip } = Pagination(req);
    const { start, end } = getDateRangeFromQuery(req.query);

    const [total, projects] = await Promise.all([
      Project.countDocuments({
        clientId,
        createdAt: { $gte: start, $lte: end },
      }),
      Project.find({ clientId, createdAt: { $gte: start, $lte: end } })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({
      data: projects,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

// ^Get all forms for a client (monthly + paginated)
exports.getForms = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page, limit, skip } = Pagination(req);
    const { start, end } = getDateRangeFromQuery(req.query);

    const [total, forms] = await Promise.all([
      Form.countDocuments({ clientId, createdAt: { $gte: start, $lte: end } }),
      Form.find({ clientId, createdAt: { $gte: start, $lte: end } })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({
      data: forms,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching forms", error: error.message });
  }
};

// ^ Get all form submissions for a client (monthly + paginated)
exports.getSubmissions = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page, limit, skip } = Pagination(req);
    const { start, end } = getDateRangeFromQuery(req.query);

    const [total, submissions] = await Promise.all([
      FormSubmission.countDocuments({
        clientId,
        createdAt: { $gte: start, $lte: end },
      }),
      FormSubmission.find({ clientId, createdAt: { $gte: start, $lte: end } })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({
      data: submissions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

//^Get dashboard overview (counts only)
exports.getOverview = async (req, res) => {
  try {
    const { clientId } = req.params;
    const [projects, forms, submissions] = await Promise.all([
      Dashboard.getProjectsByClient(clientId),
      Dashboard.getFormsByClient(clientId),
      Dashboard.getSubmissionsByClient(clientId),
    ]);

    res.json({
      counts: {
        projects: projects.length,
        forms: forms.length,
        submissions: submissions.length,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error building overview", error: err.message });
  }
};

// data: {
//   projects,
//   forms,
//   submissions
// }
