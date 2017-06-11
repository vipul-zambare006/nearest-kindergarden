var express = require('express');

var Subscriber = require("../models/subscriber");
var ApplicationForm = require("../models/applicationform");
var Customer = require("../models/customer");

var router = express.Router();

// most specific routes first
router.get('/completed', function(req, res, next) {
  var id = req.flash("id");
  if(!id) {
    res.redirect("/");
  }

  Customer.findById(id, function(err, customer) {
    if(err){ return next(err); }

    if(!customer) {
      res.redirect("/");
      return;
    }

    Subscriber.findOne({ subscriberEmail: customer.subscriberEmail }, function(err, center){
      if(err){ return next(err); }

      if(!center) { 
        res.redirect("/");
        return;
      }

      ApplicationForm.findOne({ subscriberEmail: center.subscriberEmail }, function(err, form) {
        if(err){ return next(err); }

        if(!form) {
          res.redirect("/");
          return;
        }

        res.locals.center = center;
        res.locals.option = form;
        res.locals.customer = customer;

        res.render("completed");
      });
    });
  });
});

router.get('/:centername', function(req, res, next) {
  Subscriber.findOne({ centerName: req.params.centername }, function(err, center){
    if(err){ return next(err); }
    
    if(!center) { 
      res.redirect("/");
      return;
    }

    ApplicationForm.findOne({ subscriberEmail: center.subscriberEmail }, function(err, form) {
      if(err){ return next(err); }
      if(!form) {
        res.redirect("/");
        return;
      }
      res.locals.center = center;
      res.locals.option = form;
      res.render("apply");
    });
  });
});

router.get('/', function(req, res, next){
  res.redirect("/");
});

router.post('/', function(req, res, next) {

  var toSave = new Customer({

    subscriberEmail : req.body.subscriberEmail,

    customerName : req.body.customerName,
    customerPersonId : req.body.customerPersonId,
    customerRelationship : req.body.customerRelationship,
    customerAddress : req.body.customerAddress,
    customerContact : req.body.customerContact,
    customerEmail : req.body.customerEmail,
    
    childName : req.body.childName,
    childBirthCertificateNo : req.body.childBirthCertificateNo,
    childDateOfBirth : req.body.childDateOfBirth,
    childGender : req.body.childGender

  });

  toSave.save(function(err, saved){
    if(err){
      next(err);
      return;
    }

    req.flash("info", "Application has been submitted.");
    req.flash("info", "kindergarten Center will contact you directly for your application.");
    req.flash("id", saved.id);
    console.log('/apply/completed saved id :' + saved.id);
    res.redirect('/apply/completed') ;
  });

});



module.exports = router;
