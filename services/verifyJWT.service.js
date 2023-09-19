const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.jwtSecret;

function verifyJWT(req, res, next) {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
      return res.status(401).json({ message: 'Token is missing.' });
    }
    
    const tokenParts = tokenHeader.split(' ');
    
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format.' });
    }
    
    const token = tokenParts[1];
    


  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid." });
    }
    req.user = decoded;
    next();
  });
}

module.exports = verifyJWT;
