//all middileware goes here
var Image = require("../models/image");
var Comment = require("../models/comment");
var Service = require("../models/service");
var Testimonial = require("../models/testimonial");


var middlewareObj = {};


middlewareObj.checkImageOwnership = function(req, res, next){
    //is user logged in ? 
    if(req.isAuthenticated()){
        // getting an ID to use in image edit page
        Image.findById(req.params.id, function(err, foundImage){    
            if(err || !foundImage){
                req.flash("error", "Image not found");
                res.redirect("back");
            }else{
                //does user own the image?
                //console.log(req.body.image);
                if(foundImage.author.id.equals(req.user._id)|| req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
                 
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
        
    }
    
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    //is user logged in ? 
    if(req.isAuthenticated()){
        // getting an ID to use in image edit page
        Comment.findById(req.params.comment_id, function(err, foundComment){    
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                //does user own the comment?
                //console.log(req.body.image);
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don't have permission");
                    res.redirect("back");
                }
                 
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    
}

middlewareObj.checkServiceOwnership = function(req,res,next){
    //is user logged in ? 
    if(req.isAuthenticated()){
        // getting an ID to use in image edit page
        Service.findById(req.params.id, function(err, foundService){    
            if(err || !foundService){
                req.flash("error", "Service not found");
                res.redirect("back");
            }else{
                //does user own the comment?
                //console.log(req.body.image);
                if(foundService.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don't have permission");
                    res.redirect("back");
                }
                 
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    
}

middlewareObj.checkTestimonialOwnership = function(req,res,next){
    //is user logged in ? 
    if(req.isAuthenticated()){
        // getting an ID to use in image edit page
        Service.findById(req.params.id, function(err, foundService){    
            if(err || !foundService){
                req.flash("error", "Service not found");
                res.redirect("back");
            }else{
                //does user own the comment?
                //console.log(req.body.image);
                if(foundService.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don't have permission");
                    res.redirect("back");
                }
                 
            }
        });
    }else{
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
    
}


middlewareObj.isLoggedIn =function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");//it wont display. It will just access to this error. (key,value)
    res.redirect("/login");
}


module.exports = middlewareObj;