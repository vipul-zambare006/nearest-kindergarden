var mongoose = require("mongoose");

var schema = mongoose.Schema({
    subscriberEmail: {type: String, required: true, unique: true },
    askCustomerName : { type: Boolean , default: true },
    askCustomerPersonId : { type: Boolean , default: true },
    askCustomerRelationship : { type: Boolean , default: false },
    askCustomerAddress : { type: Boolean , default: false },
    askCustomerContact : { type: Boolean , default: true },
    askCustomerEmail : { type: Boolean , default: false },
    askChildName : { type: Boolean , default: true },
    askChildBirthCertificateNo : { type: Boolean , default: true },
    askChildDateOfBirth : { type: Boolean , default: false },
    askChildGender : { type: Boolean , default: false }
});

var ApplicationForm = mongoose.model("ApplicationForm", schema);

module.exports = ApplicationForm;