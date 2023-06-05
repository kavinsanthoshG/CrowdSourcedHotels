const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const hotel = require("../controller/hotels");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const {
  isAuthor,
  validateHotel,
  isLoggedIn,
  hotExist,
} = require("../middleware");

router.route("/new").get(isLoggedIn, hotel.renderNewHotel).post(
  isLoggedIn,
  upload.array("images", 4),
  // (req, res) => {
  //   // console.log(req.body);
  //   console.log("Image Info:", req.files);
  //   res.send("It is workign");
  // }

  validateHotel,
  catchAsync(hotel.createNewHotel)
);

router
  .route("/:id/edit")
  .get(
    hotExist,
    isLoggedIn,

    isAuthor,
    catchAsync(hotel.renderEditHotel)
  )

  .patch(
    hotExist,
    isLoggedIn,
    upload.array("images", 4),
    // (req, res) => {
    //   console.log(req.body);

    //   res.send("It is workign");
    // }
    validateHotel,

    isAuthor,
    catchAsync(hotel.editHotel)
  );

router.delete(
  "/:id/delete",
  isLoggedIn,
  hotExist,
  isAuthor,
  catchAsync(hotel.deleteHotel)
);

router.get(
  "/:id",

  hotExist,
  catchAsync(hotel.getHotel)
);

router.get("", catchAsync(hotel.allHotels));

module.exports = router;
