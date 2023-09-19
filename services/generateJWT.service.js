const jwt = require("jsonwebtoken");
require('dotenv').config();


function generateJWT(username, password, name, email, contact) {
  const secretKey = process.env.jwtSecret;

  const payload = {
    username,
    password,
    name,
    email,
    contact
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "2h" });

  return token;
}

module.exports = generateJWT;
