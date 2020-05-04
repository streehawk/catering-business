var express     = require("express");
var router      = express.Router();
var Service     = require("../models/service");
var middileware = require("../middleware");

//SERVICE INDEX
router.get("/", function(req,res){
    Service.find({}, function(err, allServices){
        if(err){
            console.log(err);
        }else{
            res.render("services/index", {services: allServices});
        }
        
    });
});

//SERVICE NEW
router.get("/new", middileware.isLoggedIn, function(req, res){
    res.render("services/new");
});

//SERVICE CREATE: Add service to db
router.post("/", middileware.isLoggedIn, function(req,res){
    //get data from form
    req.body.service.desc = req.sanitize(req.body.service.desc)
    var newService= req.body.service;
    Service.create(newService, function(err,newlyCreated){
        if(err){
            console.log(err);
            res.render("services/new");
        }else{
            console.log(req.body.service);
            console.log(req.body.desc);
            console.log(newlyCreated);
            res.redirect("/services");
        }
        
    });
    
});

// SHOW
router.get("/:id", function(req, res) {
    Service.findById(req.params.id, function(err,foundService){
        if(err){
            req.flash("error", "Service not found");
            res.redirect("/services");
        }else{
            res.render("services/show", {service:foundService});
        }
    });
});
//     Service.findById(req.params.id, function(err, foundService){
//         if(err || !foundService){
//             req.flash("error, Service not found");
//             res.redirect("back");
//         }else{
//             console.log(foundService);
//             res.render("/services/show");
            
//         }
//     });
    
// });

//EDIT
router.get("/:id/edit", function(req, res) {
    //get id
    Service.findById(req.params.id, function(err, foundService){
        if(err){
            req.flash("error", "Service not found");
            res.redirect("/services");
        } else{
            res.render("services/edit",{service:foundService});
        }
    });
});

//Update
router.put("/:id", function(req, res){
    Service.findByIdAndUpdate(req.params.id, req.body.service, function(err, updatedService){
        if(err){
            req.flash("error", "Service not found");
            res.redirect("/services");
        }else{
            res.redirect("/services/"+req.params.id);
        }
    });
});

//Delete
router.delete("/:id", function(req, res){
    Service.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error", "Service not found");
            res.redirect("/services");
        }else{
            res.redirect("/services");
        }
    });
});
module.exports = router;