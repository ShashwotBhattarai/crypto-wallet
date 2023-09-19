const express = require("express");
const router = express.Router();
const UserDetails = require("../database/schemas/user-details.schema");
const verifyJWT = require("../services/verifyJWT.service");

router.put("/:u_id", verifyJWT, async (req, res) => {
  try {
    const { u_id } = req.params;
    const updatedDetails = req.body;

    console.log(u_id);
    const result = await UserDetails.findOneAndUpdate(
      { u_id },
      { $set: updatedDetails },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "User details not found." });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user details." });
  }
});

module.exports = router;
