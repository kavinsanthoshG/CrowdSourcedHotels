const User = require("../model/user");

module.exports.renderNewUser = (req, res) => {
  res.render("users/register");
};

module.exports.createNewUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, function (err) {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Account Created Successfully!");
        res.redirect("/hotels");
      }
    });
    // res.send(newUser);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/hotels");
  });
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirection = res.locals.returnTo || "/hotels";
  res.redirect(redirection);
};
