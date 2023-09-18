require("dotenv").config();
const express = require("express");
const path = require("path");

const connectMongoDB = require("./db");
const session = require("express-session");
const passport = require("passport");
const configPassport = require("./passport");
const flash = require("connect-flash");
const ERRORS = require("./controllers/messages");

const index = require("./routes/index");
const auth = require("./routes/auth");
const problems = require("./routes/problems");

const app = express();

connectMongoDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
  secret: process.env.PASSPORT_SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 259200,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

configPassport();

app.use("/", index);
app.use("/", auth);
app.use("/problems", problems);

app.use(function (req, res, next) {
  const err = new Error(ERRORS.NOT_FOUND);
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;

  const isDevelopment = req.app.get("env") === "development";
  res.locals.error = isDevelopment ? err : {};

  const status = err.status || 500;

  // if (!isDevelopment && status === 500) {
  if (status === 500) {
    res.render("error", {
      message: ERRORS.INTERNAL_SERVER_ERROR,
      error: { status: 500 },
    });
  } else {
    res.render("error", {
      message: err.message || ERRORS.UNKNOWN_ERROR,
      error: { status: err.status },
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port http://localhost:3000");
});

module.exports = app;
