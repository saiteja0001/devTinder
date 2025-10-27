const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_DATA_SAFE = "firstName lastName photoUrl about skills age gender";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA_SAFE);
    //   .populate("fromUserId", ["firstName", "lastName"]);
    if (!connectionRequests) {
      return res.status(404).json({ message: "No connection requests found" });
    }
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA_SAFE)
      .populate("toUserId", USER_DATA_SAFE);
    console.log(connectionRequests, "connectionrequests");
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    if (!connectionRequests) {
      return res.status(404).json({ message: "No connection requests found" });
    }
    res.json({
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = req.query.limit;
    limit > 50 ? 50 : limit;
    const page = req.query.page;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersData = new Set();
    connectionRequests.forEach((row) => {
      hideUsersData.add(row.fromUserId.toString());
      hideUsersData.add(row.toUserId.toString());
    });
    console.log(hideUsersData, "hideUsersData");
    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUsersData) } },
      ],
    }).select(USER_DATA_SAFE).skip(skip).limit(limit);

    if (users.length === 0) {
      res.send("user not found");
    } else {
      res.json({ message: "Data fetched succesfully", data: users });
    }
  } catch (error) {
    res.status(400).send("something went wrong..." + error.message);
  }
});

module.exports = userRouter;
