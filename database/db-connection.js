const mongoose = require("mongoose");
require('dotenv').config();


function dbConnect() {
  mongoose.connect(
    process.env.databaseConnectionString
  );
}

module.exports = dbConnect;
