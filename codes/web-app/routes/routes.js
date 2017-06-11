var express= require("express");
var passport = require("passport");

var index = require('./index');
var signup = require('./signup');
var kindergarten = require('./kindergarten');
var apply = require('./apply');

var router = express.Router();

router.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.use("/", index);
router.use("/signup", signup);
router.use("/kindergarten", kindergarten);
router.use("/apply", apply);

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect: "/kindergarten",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;