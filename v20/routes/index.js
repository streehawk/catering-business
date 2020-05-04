var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Image       = require("../models/image");
var async       = require("async");
var nodemailer  = require("nodemailer");
var crypto      = require("crypto");



//=======================
// Authentication Routes
//=======================
//this will be home page 
//root route
router.get("/", function(req, res){
    res.render("landing");
    
});

//show register form
router.get("/register", function(req,res){
    res.render("register");
})

//handle sign up logic
router.post("/register", function(req,res){
    var newUser = new User(
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
      });
      
    if(req.body.adminCode === 'iLikeTurtles'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password,function(err,user){
        if(err){
            // console.log(err)
            return res.render("register",{error: err.message});
        }
       passport.authenticate("local")(req, res, function(){
           req.flash("success","Welcome to Food World " + user.username);
           res.redirect("/images")
              
       });
   });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handling login logic
//middileware
// app.post("/login", middileware, call back)
router.post("/login", passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash: true,
    //successFlash: 'Welcome to Andre World!'
}), function(req, res) {
    res.send("Login logic");
});

//logout route
//logout comes with the package
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "See you soon");
    res.redirect("back");
    
})

// ===========================
    // FORGOT PASSWORD ROUTE
// ===========================

router.get('/forgot', function(req,res){
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        //token will be sent as part of url to user email and user click that link that expires in an hour 
        done(err, token);
      });
    },
    function(token, done) {
    // finding user by email address 
      User.findOne({ email: req.body.email }, function(err, user) {
        if(err){
          req.flash("error", "Something went wrong");
        }else if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'testthinkinsidethebun@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'testthinkinsidethebun@gmail.com',
        subject: 'Password Reset for Think Inside The Bun',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// =============================
//  RESET PASSWORD ROUTE
// =============================

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

// enter new password
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: undefined//provide email
          pass: undefined//provide password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'testthinkinsidethebun@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
      if(err){
          req.flash('error', 'Something went wrong.');
          console.log(err);
      }else{
          res.redirect('/');
      }
    
  });
});

//===============================
//    User profile
//===============================
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", "Something went wrong");
      res.redirect("/");
    }
      // eval(require("locus"));
    Image.find().where('author.id').equals(foundUser._id).exec(function(err,images){
      if(err){
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
     res.render("users/show", {user: foundUser, images: images});
      
    });
   
  });
});

module.exports = router;
