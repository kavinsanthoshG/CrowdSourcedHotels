const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cities = require("./cities");

const Hotel = require("../model/hotel");

const { descriptors, places } = require("./seedHelpers");

mongoose.connect(
  "mongodb+srv://CSHotels:KAVINHOTELS@cluster0.wcrdeqj.mongodb.net/?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seed = async () => {
  for (let i = 0; i < 300; i++) {
    const randDom1000 = Math.floor(Math.random() * 1000);
    const hot = new Hotel({
      author: "647f08086a32273fcff0c1aa",
      location: `${cities[randDom1000].city}, ${cities[randDom1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[randDom1000].longitude,
          cities[randDom1000].latitude,
        ],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dlbb63f41/image/upload/v1685039648/yelpCamp/1685039646675-kavinPhoto.jpg.jpg",

          filename: "yelpCamp/1685004687984-POCONFC.png",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis obcaecati magni tempora deleniti, placeat optio ex itaque nobis adipisci? Sit autem voluptates eaque voluptatum accusantium magni possimus nostrum fuga obcaecati",
      price: Math.floor(Math.random() * 100) + 1,
    });
    await hot.save();
  }
};

seed();
