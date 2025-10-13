const express = require("express");
const requestsRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUserId = req.user._id;

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User does not exist");
      }
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type:" + status);
      }

      const existingConnectionreq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionreq) {
        throw new Error("Connection request already exists");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} ${status} ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type:" + status });
      }
      const existingConnectionreq = await connectionRequest.findOne({
        _id: requestId,
        toUserId:loggedInUser._id,
        status:"interested"
      });
      if(!existingConnectionreq){
        return res.status(400).json({message: "Connection request not found"});
      };
      existingConnectionreq.status = status;
      const data = await existingConnectionreq.save();
      res.json({message: `Connection request status updated to ${status}`, data});

    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);
module.exports = requestsRouter;
