const Hotel = require("../model/hotel");
const cloudinary = require("cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const MY_ACCESS_TOKEN = process.env.MAPBOX_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

module.exports.renderNewHotel = (req, res) => {
  res.render("./hotel/new");
};
module.exports.createNewHotel = async (req, res) => {
  const hot = new Hotel(req.body);
  hot.author = req.user._id;
  // console.log("before", req.files);
  const response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  // console.log(response.body.features);

  const getGeoCode = response.body;
  if (!(getGeoCode.features && getGeoCode.features.length > 0)) {
    req.flash(
      "error",
      "Couldn't find the City you have Entered. Enter the Correct Name!"
    );
    return res.redirect("/hotels/new");
  }

  const coordinates = getGeoCode.features[0].geometry;
  hot.geometry = coordinates;

  hot.image = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));

  await hot.save();
  req.flash("success", "successfully registered your Hotel");

  return res.redirect(`/hotels/${hot._id}`);
};

module.exports.renderEditHotel = async (req, res) => {
  const { id } = req.params;
  const hotEjs = await Hotel.findById(id);

  res.render("./hotel/edit", { hotEjs });
};

module.exports.editHotel = async (req, res) => {
  const { id } = req.params;

  const hotEjs = await Hotel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // console.log(req.files);
  const saveImg = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));
  // console.log(req.body.deleteImages);

  if (req.body.deleteImages) {
    await Hotel.updateOne(
      { _id: id },
      { $pull: { image: { filename: { $in: req.body.deleteImages } } } }
    );
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(`${filename}`, function (result) {
        console.log(result);
      });
      console.log(filename);
    }
  }
  hotEjs.image.push(...saveImg);
  await hotEjs.save();
  // console.log(hotEjs);

  req.flash("success", "successfully Edited your Hotel");
  res.redirect(`/hotels/${hotEjs._id}`);
};

module.exports.deleteHotel = async (req, res) => {
  const { id } = req.params;

  await Hotel.findOneAndDelete({ _id: id });
  req.flash("success", "successfully Deleted your Hotel");
  res.redirect("/hotels");
};

module.exports.getHotel = async (req, res) => {
  const hotEjs = await Hotel.findById(req.params.id).populate([
    { path: "reviews", populate: { path: "author" } },
    "author",
  ]);

  // console.log(req.user);
  const currentUser = req.user;

  res.render("./hotel/show", { hotEjs, currentUser }); // pass the success message to the EJS file
};

module.exports.allHotels = async (req, res) => {
  const hotels = await Hotel.find({});
  hotels.reverse();
  res.render("./hotel/hotels", {
    hotels,
    title: "Hotels",
  });
};
