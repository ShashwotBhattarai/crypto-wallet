const mongoose = require("mongoose");

const currentWalletSchema = new mongoose.Schema({
  w_id: { type: String, required: true },

  balance: { type: Number, required: true },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const CurrentWallet = mongoose.model("CurrentWallet", currentWalletSchema);
module.exports = CurrentWallet;
