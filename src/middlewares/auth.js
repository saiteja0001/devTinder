const User = require("../models/user");
var jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.headers.token;
  const isAuthorized = token === "admintoken";
  if (!isAuthorized) {
    res.status(401).send("UnAuthorized");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$45");
    const { _id } = decodedMessage;
    console.log("logged in user is " + _id);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
};

// const userAuth = (req, res, next) => {
//     const token = req.headers.token;
//     console.log(req.body,'reqbody')
//     const isAuthorized = token === "usertoken";
//     if (!isAuthorized) {
//       res.status(401).send("UnAuthorized");
//     } else {
//       next();
//     }
//   };

module.exports = {
  adminAuth,
  userAuth,
};
