var mongoose = require("mongoose");

var bookingSchema = mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    phone: {type:Number, required: true},
    eventDate: Date,
    eventAddress: String,
    service: String,
    meat: String,
    sides: String,
    attendees: {type:Number, required: true}
})

module.exports = mongoose.model("Booking", bookingSchema);