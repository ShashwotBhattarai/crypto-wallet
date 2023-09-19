const express = require("express");
const router = express.Router();
const UserDetails = require("../database/schemas/user-details.schema");
const CurrentWallet = require("../database/schemas/current_wallet.schema");
const verifyJWT = require("../services/verifyJWT.service");

router.post("add/:u_id", verifyJWT ,async (req, res) => {
  try {
    const { u_id } = req.params;
    const { wallets } = req.body;

    const user = await UserDetails.findOne({ u_id });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    for (const w_id of wallets) {
      const isWIdInUserWallets = user.wallets.includes(w_id);

      if (!isWIdInUserWallets) {
        user.wallets.push(w_id);
      }

      const existingWallet = await CurrentWallet.findOne({ w_id });
      console.log(existingWallet);

      if (!existingWallet) {
        await CurrentWallet.create({ w_id, balance: 0 });
      }
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to add wallet." });
  }
});

router.get("/get/:u_id", verifyJWT, async (req, res) => {
  try {
    const u_id = req.params.u_id;

    const user = await UserDetails.findOne({ u_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wallets = user.wallets;

    return res.status(200).json(wallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/delete/:u_id/:wallet_id", verifyJWT, async (req, res) => {
  try {
    const u_id = req.params.u_id;
    const wallet_id = req.params.wallet_id;

    const user = await UserDetails.findOne({ u_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const walletIndex = user.wallets.indexOf(wallet_id);

    if (walletIndex === -1) {
      return res
        .status(404)
        .json({ message: "Wallet not found in user's wallet array" });
    }

    user.wallets.splice(walletIndex, 1);

    await user.save();

    await CurrentWallet.findOneAndDelete({w_id:wallet_id});


    return res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
