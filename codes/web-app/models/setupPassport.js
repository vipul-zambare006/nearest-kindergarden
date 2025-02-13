var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./subscriber");

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy(function(username, password, done) {
    User.findOne({ subscriberEmail: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "Invalid email or password." });
      }
      user.checkPassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid email or password." });
        }
      });
    });
  }));

};
