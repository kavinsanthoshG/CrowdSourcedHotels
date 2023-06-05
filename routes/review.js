const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");

const review = require("../controller/reviews");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post("", isLoggedIn, validateReview, catchAsync(review.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,

  catchAsync(review.deleteReview)
);

module.exports = router;
