const bcrypt = require("bcrypt");

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        reject("Error generating salt: " + err);
      }

      bcrypt.hash(password, salt, async function (err, hashedPassword) {
        if (err) {
          reject("Error hashing password: " + err);
        } else {
          resolve(hashedPassword);
        }
      });
    });
  });
}

module.exports = hashPassword;
