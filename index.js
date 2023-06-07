if (process.env.NODE_ENV !== "production") {
  console.log("in development");
}
require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const engine = require("ejs-mate");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./model/user");

const userRoutes = require("./routes/user");
const hotelRoutes = require("./routes/hotel");
const reviewRoutes = require("./routes/review");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const secret = process.env.SECRET;
app.use(methodOverride("_method"));
app.use(mongoSanitize());

const dbUrl = process.env.DBURL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(
  session({
    store,
    name: "blah",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true,
      //COMMENT ABOVE TO RUN ON LOCALHOST
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  // console.log(req.query);
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("ejs", engine);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found fuck", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;

  if (!err.message) {
    err.message = "oh no, something went wrong";
  }

  res.status(status);

  res.render("./errorTemplate", { err });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server has Started on ${port}`);
});
