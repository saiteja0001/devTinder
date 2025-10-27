const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./utils/cronjob");
const http = require("http");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);
app.use("/",userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working ✅' });
});

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("database connection established");
    server.listen(process.env.PORT, () =>
      console.log(`server is listening to created to ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("Database cannot be connected"+err);
  });

// PORT = 7777
// DB_CONNECTION = "mongodb+srv://saitejamogatadakala:sBezDhNRT1Q6jUL9@saitejanode.jlcea.mongodb.net/devTinder"
// JWTSEC = "DEV@Tinder$45"
// RPID = "rzp_test_RU7OPQzEmT5gw9"
// RPSCT ="rrcXi6gIAW5JjefFyP2xpxyM"

//  ("AKIAQDHGKHHXIVTWTPXN")
//  ("K6hbhEu0bK6THuIo2C8RXd0YuO6lqicsYRjIlyet")

// const { adminAuth, userAuth } = require("./middlewares/auth");

// app.use("/admin", adminAuth);

// app.use("/admin/getAllusersdata", (req, res) => {
//   res.send("getAllusersdata");
// });

// app.use("/user/login", (req, res) => {
//   res.send("user login sent");
// });
// app.all("/user", userAuth, (req, res) => {
//   // throw new Error("user error");
//   res.send("user data sent");
// });

// app.use("/",(err,req,res,next)=>{
//   if(err){
//     console.log(err)
//     res.status(500).send("somethin went wrong...")
//   }
// })

// app.use("/hello/:id", (req, res) => {
//   console.log(req.params);
//   res.send("hello 2");
// });

// app.use(
//   "/user",
//   (req, res, next) => {
//     next();
//     res.send("1st response");
//   },
//   (req, res, next) => {
//     // res.send("2nd response");
//     next();
//   },
//   (req, res, next) => {
//     // next();
//     res.send("3rd response");
//   }
// );

// app.use((req, res) => {
//   res.send("hello from server");
// });
