var mongoose = require("mongoose");
var serviceSchema = new mongoose.Schema({
    service: String,
    desc: String
});

module.exports = mongoose.model("Service", serviceSchema);