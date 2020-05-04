var express = require("express");
var router = express.Router();
var Booking = require("../models/booking");
var nodemailer  = require("nodemailer");
var middileware = require("../middleware");

//index
router.get("/", function(req,res){
    Booking.find({}, function(err, allBookings){
        if(err){
            req.flash("err", "Booking page not found");
            console.log(err);
        }else{
            res.render("bookings/index", {bookings: allBookings});
        }
    });
});

//create
router.post("/", function(req,res, next){
    // var newName= req.body.name;
    // var newemail = req.body.email;
    // var newDate = req.body.eventDate;
    // var newPhone = req.body.phone;
    // var newAtendees = req.body.attendees;
    // var newBooking = {name: newName, email: newemail, eventDate: newDate, phone: newPhone, attendees: newAtendees};
    
    var newBooking = req.body.booking;
    var userEmail = req.body.booking.email;
    Booking.create(newBooking, function(err, newlyCreated){
        if(err){
            console.log(err.message);
        }else{
            console.log(newBooking);
            req.flash("success", "You'll be hearing from us very soon")
            res.redirect("../");
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: undefined
            pass: undefined
          }
        });
        // thinkinsidethebun1@gmail.com
        var mailOptions = {
          from: req.body.booking.email,
          to: 'rsaeed.sages@gmail.com',
          subject: 'Sending Email using Node.js',
          text: 'Congragulation! ' + "You received an order. Please find the info below\n" 
                + "Name: " + req.body.booking.name + "\n"
                + "Event Date: " +req.body.booking.eventDate + "\n"
                + "Phone number: " + req.body.booking.phone + "\n"
                + "email: " + req.body.booking.email + "\n" 
                + "Number of attendees: " + req.body.booking.attendees + "\n"
                + "service: " + req.body.booking.service + "\n"
                + "meat: " + req.body.booking.meat + "\n"
                + "sides: " + req.body.booking.sides + "\n"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    }
});
});



//     var smtpTransport = nodemailer.createTransport({
        
//      });

//     var mailOptions = {
//         to: "rayyan.saeed@outlook.com",
//         from: 'testthinkinsidethebun@gmail.com',
//         subject: 'Form Submissoin',
//         text: req.body.booking
//     };
//     smtpTransport.sendMail(mailOptions, function(err) {
//         if(err){
//             return next(err);
//         }else{
//             console.log('mail sent');
//             req.flash('success', 'An e-mail has been sent to ');
//         }
//     });
// });

module.exports= router;