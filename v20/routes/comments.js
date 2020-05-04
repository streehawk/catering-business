var express = require("express");
var router  = express.Router({mergeParams: true});//mergeParams allow access to id in appuse() in app.js 
var Image   = require("../models/image");
var Comment = require("../models/comment");
var middileware = require("../middleware") //index.js is require so it aumatically will be implimented 



//==========================
// Comments Routes
//==========================
//COMMENTS NEW
router.get("/new",middileware.isLoggedIn, function(req,res){
    // find by id
    Image.findById(req.params.id, function(err,image){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {image: image});
        }
        
    });
});
//COMMENTS CREATE
router.post("/",middileware.isLoggedIn, function(req,res){
    //lookup the id
    //create new comment
    //connect new comment to image
    //redirect image show page
    Image.findById(req.params.id, function(err,image){
        if(err){
            console.log(err);
            res.redirect("/images");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","something went wrong");
                    console.log(err);
                }else{
                    //add username and id to comment (association)
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log(req.user.username);
                    //save comment.
                    comment.save();
                    image.comments.push(comment);
                    image.save();
                    console.log(comment);
                    req.flash("success","Successfully added comment");
                    res.redirect('/images/' + image._id);
                }
            });
        }
    });
    
    
});

//Comments Edit route
router.get("/:comment_id/edit", middileware.checkCommentOwnership, function(req,res){
    Image.findById(req.params.id, function(err, foundImage){
        if(err || !foundImage){
            req.flash("error", "No Image found");
            return res.redirect("back");
        }
        // req.params.id; //id is coming from app.js --> app.use
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
        }else{
            res.render("comments/edit",{image_id: req.params.id, comment: foundComment});
            
            }
        });
        
    });
    
    
});

//COMMENT UPDATE
router.put("/:comment_id", middileware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/images/" + req.params.id); 
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middileware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted");
            res.redirect("/images/" + req.params.id);
        }
    });
});


module.exports = router;