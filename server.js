const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

//checking
// Debug middleware to log all requests
//app.use((req, res, next) => {
  //console.log(`[${req.method}] ${req.originalUrl}`);
  //next();
//});
//!routes for  SMTPConfig
app.use('/api/smtpConfigs', require('./routes/smtpconfigRoutes'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
