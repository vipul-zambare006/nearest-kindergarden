var express = require("express");

var authorizer = function(req, res, next){
  if(!req.isAuthenticated()) {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  } else {
    var currentUser = res.locals.currentUser;
    if(currentUser.isPremium()) {
      next();
    } else {
      res.redirect("/kindergarten");
    }
  }
};

module.exports = authorizer;

