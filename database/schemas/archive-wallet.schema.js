const mongoose = require("mongoose");

const archiveWalletSchema = new mongoose.Schema({
  w_id: { type: String, required: true },

  balance: { type: Number, required: true },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const ArchiveWallet = mongoose.model("ArchiveWallet", archiveWalletSchema);
module.exports = ArchiveWallet;
