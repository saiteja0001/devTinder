const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

profileRouter.get("/user", userAuth, async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    if (users.length === 0) {
      res.send("user not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("something went wrong..." + error.message);
  }
});

profileRouter.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    // await User.findByIdAndDelete({_id:req.body.userId});
    const request = await User.findByIdAndDelete(userId);
    console.log(request, "res");
    if (request) {
      res.send("user deleted sucessfully");
    }
  } catch (error) {
    res.status(400).send("something went wrong..." + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("update not allowed");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("you cannot add more than 10 skills");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser, "loggedinuser");

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    const { firstName, lastName, emailId, gender, age, about, skills, userId } =
      loggedInUser;
    res.send({
      message: `${loggedInUser.firstName} your profile is updated successfully`,
      data: {
        firstName,
        lastName,
        emailId,
        gender,
        age,
        about,
        skills,
        userId,
      },
    });

    // const userId = req.body.userId;
    // await User.findByIdAndDelete({_id:req.body.userId});
    // const request = await User.findByIdAndUpdate(userId, req.body, {
    //   returnDocument: "after",
    //   runValidators: true,
    // });
    // console.log(request, "res");
    // if (!request) {
    //   throw new Error("user doesnot exist");

    // }
    // if (request) {
    //   res.send(request);
    // }
  } catch (error) {
    res.status(400).send("something went wrong..." + error.message);
  }
});
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser, "loggedinuser");
    if (!validator.isStrongPassword(req.body.password)) {
      throw new Error("Please enter a Strong Password");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName} your password is updated successfully`,
    });
  } catch (error) {
    res.status(400).send("something went wrong..." + error.message);
  }
});

module.exports = profileRouter;
