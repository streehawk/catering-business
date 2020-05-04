var express     = require("express");
var router      = express.Router();
var Contact     = require("../models/contact");
var middileware = require("../middleware");
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

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: undefined 
  api_key: undefined 
  api_secret: undefined
});

//index
router.get("/", function(req,res){
    Contact.find({}, function(err, allContacts){
        if(err){
            console.log(err);
        }else{
            res.render("contacts/index", {contacts: allContacts});
        }
    });
});

//new
router.get("/new", function(req,res){
    res.render("contacts/new");
});

//create
router.post("/", upload.single('image'), function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.contact.image = result.secure_url;
        var newContact = req.body.contact;
        Contact.create(newContact, function(err, newlyCreated){
            if(err){
                req.flash("error", err.message);
                res.render("back");
            }
            res.redirect("/contacts");
        });
    });
});

//edit
router.get("/:id/edit", function(req, res) {
    Contact.findById(req.params.id, function(err, foundContact){
        if(err){
            req.flash("error", "Contact not found");
            res.redirect("/")
        }else{
            res.render("contacts/edit",{contact: foundContact});
        }
    });
});

//update
router.put("/:id", function(req,res){
    Contact.findByIdAndUpdate(req.params.id, req.body.contact, function(err, updatedContact){
        if(err){
            req.flash("error", "Contact not found");
            res.redirect("/contacts");
        }else{
            res.redirect("/contacts");
        }
    });
    
});

//Destroy
router.delete("/:id", function(req, res){
    Contact.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error", "Contact not found");
            res.redirect("/contacts");
        }else{
            res.redirect("/contacts");
        }
    });
});



module.exports = router;