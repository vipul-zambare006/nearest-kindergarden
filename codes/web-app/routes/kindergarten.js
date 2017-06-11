var express = require('express');

var authenticator = require('../models/authenticator');
var authorizer = require('../models/authorizer');
var Subscriber = require("../models/subscriber");
var ApplicationForm = require("../models/applicationform");
var Customer = require("../models/customer");
var router = express.Router();

router.use(authenticator);

router.get('/', function(req, res, next) {
  var currentUser = res.locals.currentUser;
  if(currentUser.isPremium()){
    res.redirect("/kindergarten/process");
  } else {
    res.redirect("/kindergarten/profile");
  }
});

router.get('/process', authorizer, function(req, res, next) {
  var currentUser = res.locals.currentUser;

  Customer.find()
  .sort({ customerName: "ascending"})
  .exec(function(err, customers){
    if(err) { return next(err);}

    ApplicationForm.findOne({subscriberEmail: currentUser.subscriberEmail}, function(err, form){
      if(err) { return next(err); }
      if(!form){
        res.redirect("/kindergarten/applicationform");
        return;
      } 
      res.render("process", {records: customers, option: form});
    }); 
  });
});

router.get('/applicationform', authorizer, function(req, res, next) {
  var currentUser = res.locals.currentUser;

  ApplicationForm.findOne(
    { subscriberEmail: currentUser.subscriberEmail },
    function(err, form) {

      if(err) { return next(err); }
      if(form){
        res.render("applicationform", { form: form });
      } else {
        res.render("applicationform", { form: new ApplicationForm() })
      }
    });
});

router.post('/applicationform', authorizer, function(req, res, next) {
  var currentUser = res.locals.currentUser;

  ApplicationForm.findOne(
    { subscriberEmail: currentUser.subscriberEmail },
    function(err, form) {
      var toSave = null;
      if(err) { return next(err); }
      if(form){

        toSave = form;

        toSave.askCustomerName = req.body.askCustomerName;
        toSave.askCustomerPersonId = req.body.askCustomerPersonId;
        toSave.askCustomerRelationship = req.body.askCustomerRelationship;
        toSave.askCustomerAddress = req.body.askCustomerAddress;
        toSave.askCustomerContact = req.body.askCustomerContact;
        toSave.askCustomerEmail = req.body.askCustomerEmail;

        toSave.askChildName = req.body.askChildName;
        toSave.askChildBirthCertificateNo = req.body.askChildBirthCertificateNo;
        toSave.askChildDateOfBirth = req.body.askChildDateOfBirth;
        toSave.askChildGender = req.body.askChildGender;

      } else {

        toSave = new ApplicationForm({

          subscriberEmail : currentUser.subscriberEmail,
          
          askCustomerName : req.body.askCustomerName,
          askCustomerPersonId : req.body.askCustomerPersonId,
          askCustomerRelationship : req.body.askCustomerRelationship,
          askCustomerAddress : req.body.askCustomerAddress,
          askCustomerContact : req.body.askCustomerContact,
          askCustomerEmail : req.body.askCustomerEmail,
          
          askChildName : req.body.askChildName,
          askChildBirthCertificateNo : req.body.askChildBirthCertificateNo,
          askChildDateOfBirth : req.body.askChildDateOfBirth,
          askChildGender : req.body.askChildGender

        });
      }

      toSave.save(function(err){
        if(err){
          next(err);
          return;
        }

        req.flash("info", "Application Form updated successfully.");
        res.redirect('/kindergarten/ApplicationForm') ;
      });

    });
});

router.get('/profile', function(req, res, next) {
  res.render("profile");
});

router.post('/profile', function(req, res, next) {
  var currentUser = res.locals.currentUser;

  currentUser.centerName = req.body.centerName;
  currentUser.centerAddress = req.body.centerAddress;
  currentUser.centerAvailable = req.body.centerAvailable;
  currentUser.centerContact = req.body.centerContact;
  currentUser.centerPrice = req.body.centerPrice;
  
  currentUser.subscriberName = req.body.subscriberName;
  currentUser.subscriberContact = req.body.subscriberContact;
  currentUser.subscriptionType = req.body.subscriptionType;

  currentUser.save(function(err){
    if(err){
      next(err);
      return;
    }

    req.flash("info", "Profile updated successfully.");
    res.redirect("/kindergarten/profile");
  });
});


module.exports = router;
