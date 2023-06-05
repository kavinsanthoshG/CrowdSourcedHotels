const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");
const User = require("./user");

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  // console.log("this.url:", this.url);

  const thumbnailUrl = this.url.replace(
    "/upload",
    "/upload/c_crop,h_200,w_200"
  );
  // console.log("thumbnailUrl:", thumbnailUrl);

  return thumbnailUrl;
});
const opts = { toJSON: { virtuals: true } };
const hotelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: User,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: {
      type: String,
      required: true,
    },
    image: { type: [imageSchema], required: true },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Review,
      },
    ],
  },
  opts
);

hotelSchema.virtual("properties.popUp").get(function () {
  return `<strong><a href="/hotels/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});
hotelSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Hotel = new mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
