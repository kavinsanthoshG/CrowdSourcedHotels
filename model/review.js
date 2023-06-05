const { number } = require("joi");
const mongoose = require("mongoose");
const User = require("./user");

const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  body: { type: String, required: true },
  rating: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: User },
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
