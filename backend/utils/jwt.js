const jwt = require("jsonwebtoken");

const JWT_SECRET = "roadwatch_jwt_secret_key";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

const verifyTokenUtil = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyTokenUtil,
};
