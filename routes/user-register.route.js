const express = require("express");
const router = express.Router();
const UserCredential = require("../database/schemas/user-credentials.schema");
const UserDetails = require("../database/schemas/user-details.schema");
const bcrypt = require("bcrypt");
const generateJWT = require("../services/generateJWT.service");
const hashPassword = require("../services/hash-password.service");

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword, name, email, contact, gender,age } = req.body;

  try {
    const existingUser = await UserCredential.findOne({ username }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    const hashedPassword = await hashPassword(password);

    const newUserCredential = new UserCredential({ username, password: hashedPassword });
    await newUserCredential.save();

    const newUserDetails = new UserDetails({name,email,contact,gender,age})
    await newUserDetails.save();


    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password, name, email, contact, gender, age } = req.body;

  try {
    const userCredential = await UserCredential.findOne({ username }).exec();

    if (!userCredential) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userCredential.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid password." });
    }

    const token = generateJWT(username, password, name, email, contact);

    return res
      .status(200)
      .json({ message: "Authentication successful", token: token });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
