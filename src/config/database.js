const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://saitejamogatadakala:sBezDhNRT1Q6jUL9@saitejanode.jlcea.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
