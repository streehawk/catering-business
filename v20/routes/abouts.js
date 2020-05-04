var express     = require("express");
var router      = express.Router();
var About       = require("../models/about");
var middileware = require("../middleware");
//Allow user to upload pictures from computer 
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
    About.find({}, function(err,allAbouts){
        if(err){
            req.flash("error", "About page not found");
            res.redirect("/");
        }else{
            res.render("abouts/index", {abouts: allAbouts});
        }
    });       
});

//new
router.get("/new", function(req, res){
    res.render("abouts/new");
});

//create
router.post("/", upload.single('image'), function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result){
        req.body.about.image = result.secure_url;
        var newAbout = req.body.about;
        About.create(newAbout, function(err, newlyCreated){
            if(err){
                req.flash("err",err.message);
                res.redirect("back");
            }
            res.redirect("/abouts");
        });
    });
});
//show
//edit
router.get("/:id/edit", function(req,res){
    About.findById(req.params.id, function(err, foundAbout){
        if(err){
            req.flash("error", "About not found");
            res.redirect("/")
        }else{
            res.render("abouts/edit",{about: foundAbout});
        }
    });
});

//update
router.put("/:id", upload.single('image'), function(req,res){
    About.findByIdAndUpdate(req.params.id, req.body.about, function(err, updatedAbout){
        if(err){
            req.flash("error","About page not found");
            res.redirect("/abouts");
        }else{
            res.redirect("/abouts");
        }
    });
});

//destroy
router.delete("/:id", function(req,res){
    About.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("success", "You successfully deleted")
            res.redirect("/abouts");
        }else{
            res.redirect("/abouts");
        }
    });
});


module.exports = router;