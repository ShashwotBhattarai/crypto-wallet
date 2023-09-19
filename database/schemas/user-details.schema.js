const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userDetailsSchema = new mongoose.Schema({
  u_id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: {type:String, required:true},
  gender: {type: String, required: true},
  age:{ type:Number, required:true },
  wallets: {type:[String]},

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
module.exports = UserDetails;
