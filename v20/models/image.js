var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
    name: String,
    image: String,
    ingredient: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"    // now, chage the login in image create route to associate user  
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

//this expotrs 'this' file to app.js
module.exports = mongoose.model("Image", imageSchema);