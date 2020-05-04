var mongoose = require("mongoose");

var locationSchema = new mongoose.Schema({
    name:String,
    location: String,
    lat: Number,
    lng: Number
});

module.exports = mongoose.model("Location", locationSchema);