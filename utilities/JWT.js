const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.jwtSecret, { expiresIn: '3600' });
};

module.exports = {generateAccessToken}