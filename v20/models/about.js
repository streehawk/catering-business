var mongoose = require("mongoose");

var aboutSchema = new mongoose.Schema({
    title: String,
    about: String,
    image: String,
});

module.exports = mongoose.model("About", aboutSchema);