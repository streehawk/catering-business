var express         = require("express");
var router          = express.Router();
var Testimonial     = require("../models/testimonial");
var middileware     = require("../middleware");

//Testimonial index
router.get("/", function(req, res){
     Testimonial.find({}, function(err, allTestimonials){
         if(err){
             console.log(err);
         }else{
             res.render("testimonials/index", {testimonials: allTestimonials});
         }
     });
});

//New
router.get("/new", function(req, res){
    res.render("testimonials/new");
});

//create
router.post("/", function(req,res){
    var newTestimonial= req.body.testimonial;
    Testimonial.create(newTestimonial, function(err,newlyCreated){
        if(err){
            console.log(err);
            console.log("I am in err");
            res.render("testimonials/new");
        }else{
            newlyCreated.author.id = req.user._id;
            newlyCreated.author.username = req.user.username;
            console.log(req.user.username);
            //save comment.
            newlyCreated.save();
            console.log(req.body.testimonial);
            console.log(newlyCreated);
            res.redirect("/testimonials");
        }
    });
});

//EDIT
router.get("/:id/edit", function(req, res) {
    //get id
    Testimonial.findById(req.params.id, function(err, foundTestimonial){
        if(err){
            req.flash("error", "Testimonial not found");
            res.redirect("/testimonials");
        } else{
            res.render("testimonials/edit",{testimonial:foundTestimonial});
        }
    });
});

// update
router.put("/:id", function(req, res){
    Testimonial.findByIdAndUpdate(req.params.id, req.body.testimonial, function(err, updatedTestimonial){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/testimonials"); 
        }
    });
});
    
//Destroy
router.delete("/:id", function(req, res){
    Testimonial.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error", "Testimonial not found");
            res.redirect("/testimonials");
        }else{
            res.redirect("/testimonials");
        }
    });
});




module.exports = router;