const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(cors({
  origin: 'http://localhost:5173',  // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true                 // if you use cookies/auth headers
}));
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);
app.use("/",userRouter);

app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working ✅' });
});
connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen("7777", () =>
      console.log("server is listening to created to 7777")
    );
  })
  .catch((err) => {
    console.log("Database cannot be connected"+err);
  });
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
