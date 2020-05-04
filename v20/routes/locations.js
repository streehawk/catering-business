var express     = require("express");
var router      = express.Router();
var Location    = require("../models/location");
var middileware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//index
router.get("/", function(req,res){
    Location.find({}, function(err,allLocations){
        if(err){
            req.flash("error", "Location page not found");
            res.redirect("/");
        }else{
            res.render("locations/index", {abouts: allLocations});
        }
    });       
});

router.get("/new", function(req,res){
    res.render("locations/new");
});

router.post("/", function(req,res){
    var name = req.body.name;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newLocation = {name: name, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Location.create(newLocation, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/locations");
        }
    });
  });
});

module.exports = router;