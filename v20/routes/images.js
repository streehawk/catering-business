var express     = require("express");
var router      = express.Router();
var Image       = require("../models/image");
var middileware = require("../middleware") //index.js is require so it aumatically will be implimented 
//var Comment = require("../models/comment");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: undefined
  api_key: undefined 
  api_secret: undefined
});


var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - show all the images
router.get("/", function(req, res){
    //get all images from DB 
    //console.log(req.user); logged in user info
    Image.find({}, function(err,allImages){
        if(err){
            console.log(err);
        }else{
            res.render("images/index", {images: allImages});
        }
    });
});

//CREATE - add new image to DB
router.post("/", middileware.isLoggedIn, upload.single('image'), function(req, res){
    
  cloudinary.uploader.upload(req.file.path,function(result){
      // add cloudinary url for the image to the image object under image property
      req.body.image.image = result.secure_url;
      //add author to image
      req.body.image.author = {
          id:req.user.id,
          username: req.user.username
      }
    // Create a new campground and save to DB
        Image.create(req.body.image, function(err, newlyCreated){
            if(err){
                req.flash("error", err.message);
                return res.redirect("back")
            } 
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/images");
        });
    });
});

// // CREATE - add new images to DB
// router.post("/",middileware.isLoggedIn, function(req,res){
//     //get data from form
//     var name = req.body.name;
//     var image = req.body.image;
//     var ingr = req.body.ingredient;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newImage = {name: name, image: image, ingredient: ingr, author: author}
//     //console.log(req.user); //this have current user lgged in and if nobody is online then its gonna be null
//     // create a new image and save to DB
//     Image.create(newImage, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         }else{
//             // redirect back to images page
//             console.log(newlyCreated);
//             res.redirect("/images");
//         }
        
//     });
//     // images.push(newFoodImage);
// });



// NEW - show form to create new images 
router.get("/new", middileware.isLoggedIn, function(req, res) {
    // new.ejs is in images folder
    res.render("images/new");
});

// SHOW - shows ingredient about one image food
router.get("/:id", function(req, res) {
    // FInd the image which provided 
    Image.findById(req.params.id).populate("comments").exec(function(err, foundImage){
        if(err || !foundImage){
            req.flash("error", "Image not found");
            res.redirect("back");
        }else{
            console.log(foundImage);
             // render show template with that image
             res.render("images/show", {image: foundImage});
        }
    });
});

//Edit image route 
router.get("/:id/edit", middileware.checkImageOwnership, function(req, res) {
    // getting an ID to use in image edit page
    Image.findById(req.params.id, function(err, foundImage){    
        res.render("images/edit", {image: foundImage});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middileware.checkImageOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.image.lat = data[0].latitude;
    req.body.image.lng = data[0].longitude;
    req.body.image.location = data[0].formattedAddress;

    Image.findByIdAndUpdate(req.params.id, req.body.image, function(err, updatedImage){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/images/" + image._id);
        }
    });
  });
});

// //update image route
// router.put("/:id",middileware.checkImageOwnership, function(req,res){
//     // find and update the correct image
//     //redirect show page
//     // var data = {name: req.body.name, image: req.body.image} instead we jus wrap inside image[name] in edit page
//     //findByIdAndUpdate(waht ID we are looking for, data we want to update,data, call back function)
//     Image.findByIdAndUpdate(req.params.id, req.body.image, function(err, updatedImage){
//         if(err){
//             res.redirect("/images");
//         }else{
//             res.redirect("/images/"+ req.params.id)
//         }
        
//     });
// });

//DESTROY IMAGE ROUTE
router.delete("/:id", middileware.checkImageOwnership, function(req,res){
   Image.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/images");
       }else{
           res.redirect("/images")
       }
   }) 
});



module.exports = router;