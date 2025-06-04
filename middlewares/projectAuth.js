const jwt = require('jsonwebtoken');
require('dotenv').config();

const projectTokenAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ message: 'Project token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.PROJECT_TOKEN_SECRET);
    req.project = decoded; // Attach the decoded project info to the request object
    next();  // Proceed to the next middleware/controller
  } catch (err) {
    return res.json({ message: 'Invalid or expired project token' });
  }
};

module.exports = projectTokenAuth;
