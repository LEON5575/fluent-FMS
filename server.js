const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/smtpConfigs', require('./routes/smtpconfigRoutes'));//!routes for  SMTPConfig
app.use('/api/emailTemplates/admin', require('./routes/emailTemplateAdminRoutes')); //!routes for EmailTemplateAdmin
app.use('/api/emailTemplates/user', require('./routes/emailTemplateUserRoutes')); //!routes for EmailTemplateUser
app.use('/api/forms', require('./routes/formRoutes')); //!routes for Form
app.use('/api/formsubmissions', require('./routes/formSubmissionRoutes')); //!routes for FormSubmission
app.use('/api/clientusers',require('./routes/clientUserRoutes'))//!routes for clientDetails

//!client Dashboard
app.use('/api/clientsDashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//&checking
// Debug middleware to log all requests
//app.use((req, res, next) => {
  //console.log(`[${req.method}] ${req.originalUrl}`);
  //next();
//});