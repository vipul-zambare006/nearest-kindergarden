var express = require("express");

var authenticator = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }  
};

module.exports = authenticator;

