var express = require('express');

var NodeGeocoder = require("node-geocoder");
var Subscriber = require("../models/subscriber");

var router = express.Router();

var geocoder = NodeGeocoder({
  provider: 'google'
});

// NUS-ISS
var defaultLocation =  {
  latitude : 1.2921165,
  longitude : 103.776566
}

router.get('/', function(req, res, next) {
  Subscriber.find()
  .sort({ centerName: "ascending"})
  .exec(function(err, subscribers){
    if(err) { return next(err);}
    res.render("index", {records: subscribers, myAddress: "", myLat: defaultLocation.latitude , myLng: defaultLocation.longitude })
  });
});

router.post('/', function(req, res, next) {
  var address = req.body.address;
  var distance = req.body.distance;

  if(!address){
    Subscriber.find()
    .sort({ centerName: "ascending"})
    .exec(function(err, subscribers){
      if(err) { return next(err);}
      res.render("index", {records: subscribers})
    });
    return;
  }

  geocoder.geocode(address, function(err, results){
    if(err) { return next(err); }
    var myLocation = results[0];

    console.log('geocoder response: ---');
    console.log(results.length);
    console.log(myLocation.latitude);
    console.log(myLocation.longitude);
    console.log(myLocation.country);
    console.log(myLocation.countryCode);
    console.log(myLocation.city);
    console.log(myLocation.zipcode);
    console.log(myLocation.streetName);
    console.log(myLocation.streetNumber);
    console.log('geocoder response: ---');

    var target = [
      myLocation.longitude,
      myLocation.latitude
    ];

    var criteria = {
      'centerCoordinates' : {
        $near: {
          $geometry:{
            type: "Point",
            coordinates: target 
          },
          $maxDistance: distance * 1609.34
        }
      }
    };

    Subscriber.find(criteria)
    .sort({ centerName: "ascending"})
    .exec(function(err, subscribers){
      if(err) { return next(err);}
      res.render("index", {records: subscribers, myAddress: address, myLat: myLocation.latitude || 1.2921165, myLng: myLocation.longitude || 103.776566 })
    });

  });
});

module.exports = router;
