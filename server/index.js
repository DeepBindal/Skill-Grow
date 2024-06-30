const express = require("express");
const ExpressError = require("./utils/ExpressError");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require("./middleware");
const courseRouter = require('./routes/courseRoutes')
require('dotenv').config()
const app = express();
// console.log(process.env)

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(5000, () => {
  console.log("Listening at port 5000");
});

app.use("/auth", userRouter);
app.use("/api/course", courseRouter)

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong " } = err;
  res.status(statusCode).json({ message });
});

app.get('/protected', verifyToken, (req, res) => {
  console.log(req.user);
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get("/getGoogleToken", (req, res) => {
  const token = process.env.GOOGLE_CLIENT_ID;
  res.json(token);
})

app.get("/", (req, res, next) => {
  // next(new ExpressError(400, "Not found"))
  res.send("hello world")
});
