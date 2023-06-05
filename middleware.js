const { reviewSchema, hotelSchema } = require("./schemas.js");

const ExpressError = require("./utils/ExpressError.js");
const Hotel = require("./model/hotel.js");
const Review = require("./model/review.js");

const isLoggedIn = (req, res, next) => {
  // console.log("log");
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};
const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

const hotExist = async (req, res, next) => {
  const { id } = req.params;
  const hotEjs = await Hotel.findById(id);
  // console.log("exist");
  if (!hotEjs) {
    req.flash("error", "No such Hotel Exists!");
    return res.redirect("/hotels");
  }
  next();
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;

  const hot = await Hotel.findById(id);

  // console.log("below", req.user);
  if (!hot.author.equals(req.user._id)) {
    req.flash("error", "You do not have Permission for this!");
    return res.redirect(`/hotels/${id}`);
  }

  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  console.log("review id", reviewId);

  const review = await Review.findById(reviewId);
  console.log("review.author", review.author);
  console.log("req.user", req.user);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have Permission for this!");
    return res.redirect(`/hotels/${id}`);
  }

  next();
};

const validateHotel = (req, res, next) => {
  // console.log("before", req.body);
  const toValidate = { ...req.body };
  delete toValidate.deleteImages;
  // console.log("after", req.body);
  const { error } = hotelSchema.validate(toValidate);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 404);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 404); // Modified line
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  storeReturnTo,
  hotExist,
  validateHotel,
  isAuthor,
  isLoggedIn,
  validateReview,
  isReviewAuthor,
};
