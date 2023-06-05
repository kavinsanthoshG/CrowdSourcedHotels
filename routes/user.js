const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

const { storeReturnTo } = require("../middleware");
const user = require("../controller/user");

const passport = require("passport");

router
  .route("/register")
  .get(user.renderNewUser)
  .post(catchAsync(user.createNewUser));

router.get("/logout", user.logout);

router
  .route("/login")
  .get(user.renderLogin)

  .post(
    storeReturnTo,

    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );

module.exports = router;
