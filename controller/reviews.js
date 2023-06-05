const Review = require("../model/review");
const Hotel = require("../model/hotel");

module.exports.createReview = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  const review = new Review(req.body.review);
  review.author = req.user._id;
  hotel.reviews.push(review._id);
  await review.save();
  await hotel.save();
  req.flash("success", "successfully created your Review");
  res.redirect(`/hotels/${hotel._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);

  await Hotel.findByIdAndUpdate({ _id: id }, { $pull: { reviews: reviewId } });
  req.flash("success", "successfully Deleted your Review");
  res.redirect(`/hotels/${id}`);
};
