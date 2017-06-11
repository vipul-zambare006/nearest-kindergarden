var mongoose = require("mongoose");
var dateformat = require("dateformat");

var schema = mongoose.Schema({
    subscriberEmail: {type: String, required: true },
    
    customerName : { type: String, required: true },
    customerPersonId : { type: String, required: true },
    customerRelationship : { type: String },
    customerAddress : { type: String },
    customerContact : { type: String, required: true },
    customerEmail : { type: String },

    childName : { type: String, required: true },
    childBirthCertificateNo : { type: String, required: true },
    childDateOfBirth : { type: Date },
    childGender : { type: String }
});

schema.methods.childDateOfBirthDisplay = function(){
    var customer = this;
    return dateformat(customer.childDateOfBirth, "d mmm yyyy");
}

var Customer = mongoose.model("Customer", schema);

module.exports = Customer;