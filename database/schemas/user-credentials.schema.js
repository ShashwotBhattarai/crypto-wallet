const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userCredentialsSchema = new mongoose.Schema({
  u_c_id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  username: { type: String, required: true },
  password: { type: String, required: true },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const UserCredential = mongoose.model("UserCredential", userCredentialsSchema);
module.exports = UserCredential;
