var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
    hours: String,
    email : String,
    description: String,
    image : String
});

module.exports = mongoose.model("Contact", contactSchema);