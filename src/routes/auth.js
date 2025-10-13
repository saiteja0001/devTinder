const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    try {
      validateSignupData(req);
      const { firstName, lastName, emailId, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword,
      });
      await user.save();
      res.send("user created successfully");
    } catch (error) {
      res.status(400).send("user creation failed " + error.message);
    }
  });
  authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
  
      if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token, { httpOnly: true });
        res.send("Login successful");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  });

  authRouter.post("/logout",async (req,res) => {
    res.cookie("token",null,{
      expires: new Date(Date.now())
    }).send("logout successful");
    // res.send();
  })

  module.exports = authRouter;