var express = require('express');
var passport = require("passport");

var NodeGeocoder = require("node-geocoder");
var Subscriber = require('../models/subscriber');
var ApplicationForm = require('../models/applicationform');

var router = express.Router();

var geocoder = NodeGeocoder({
  provider: 'google'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("signup");
});

router.post('/', function(req, res, next){

  var centerName = req.body.centerName;
  
  Subscriber.findOne({ centerName: centerName }, function(err, subscriber){

    if(err) { return next(err); }

    if(subscriber) {
      req.flash("info", "Subscriber already exists.");
      return res.redirect("/signup");
    }

    var newSubscriber = new Subscriber({
      centerName: req.body.centerName,
      centerAddress: req.body.centerAddress,
      centerAvailable: req.body.centerAvailable,
      centerContact: req.body.centerContact,
      centerPrice: req.body.centerPrice,
      subscriberName: req.body.subscriberName,
      subscriberContact: req.body.subscriberContact,
      subscriberEmail: req.body.subscriberEmail,
      subscriberPassword: req.body.subscriberPassword,
      subscriptionType: req.body.subscriptionType
    });

    geocoder.geocode(newSubscriber.centerAddress, function(err, geocodeResult){
      if(err) {
        console.log('geocoder error:' + err);
        return next(err);
      }
      var location = geocodeResult[0];
      console.log('geocoder response: ---');
      console.log(geocodeResult.length);
      console.log(location.latitude);
      console.log(location.longitude);
      console.log(location.country);
      console.log(location.countryCode);
      console.log(location.city);
      console.log(location.zipcode);
      console.log(location.streetName);
      console.log(location.streetNumber);
      console.log('geocoder response: ---');

      var coordinates = [
      location.longitude,
      location.latitude
      ];

      newSubscriber.centerCoordinates = coordinates;

      newSubscriber.save(function(err){
        if(err){
          next(err);
          return;
        }

        var form = new ApplicationForm({
          subscriberEmail : newSubscriber.subscriberEmail
        });

        form.save(function(err){
          if(err){
            next(err);
            return;
          }
          // pass on the user ID and password to next 'passport.authenticate steps'
          req.body.username = req.body.subscriberEmail;
          req.body.password = req.body.subscriberPassword;
          next();
        });

      }); 

    });
    
  });

}, passport.authenticate("login", {
  successRedirect: "/kindergarten",
  failureRedirect: "/signup",
  failureFlash: true
}));

module.exports = router;
