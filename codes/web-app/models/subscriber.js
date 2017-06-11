var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs")

var BCRYPT_ROUNDS = 10;

var noop = function() {};

var schema = mongoose.Schema({
  centerName: { type: String, required: true, unique: true },
  centerAddress: {type: String, required: true },
  centerAvailable: {type: Number, required: true, default: 0},
  centerContact: {type: String, required: true},
  centerPrice: {type: Number, required: true},
  subscriberName: {type: String, required: true},
  subscriberContact: {type: String, required: true},
  subscriberEmail: {type: String, required: true, unique: true },
  subscriberPassword: {type: String, required: true},
  subscriptionType: {type: String, required: true},
  centerCoordinates: { type:[Number], index: '2dsphere'}
});

schema.pre("save", function(done) {
  var subscriber = this;

  if(!subscriber.isModified("subscriberPassword")) {
    return done();
  }

  bcrypt.genSalt(BCRYPT_ROUNDS, function(err, salt) {
    if(err) { return done(err); }
    bcrypt.hash(subscriber.subscriberPassword, salt, noop, function(err, hashedPassword) {
      if(err) { return done(err); }
      subscriber.subscriberPassword = hashedPassword;
      done();
    });
  });
});

schema.methods.checkPassword = function(guess, done){
  var subscriber = this;
  bcrypt.compare(guess, subscriber.subscriberPassword, function(err, isMatch){
    done(err, isMatch);
  });
};

schema.methods.isPremium = function(){
  var subscriber = this;
  return subscriber.subscriptionType === "Premium";
};

var Subscriber = mongoose.model("Subscriber", schema);

module.exports = Subscriber;