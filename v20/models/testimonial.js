var mongoose = require("mongoose");
var testimonialSchema = new mongoose.Schema({
    testimonial: String,
    name: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //refer to the model which is user 
        },
        username: String
    }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
    