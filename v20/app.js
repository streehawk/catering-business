require('dotenv').config();
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Image           = require("./models/image"),
    Comment         = require("./models/comment"),
    Service         = require("./models/service"),
    Testimonial     = require("./models/testimonial"),
    Contact         = require("./models/contact"),
    About           = require("./models/about"),
    Bookings        = require("./models/booking"),
    Locations       = require("./models/location"),
    User            = require("./models/user"),
    expressSanitize = require("express-sanitizer"),
    seedDB          = require("./seeds");
    
//requiring routes
var commentRoutes       = require("./routes/comments"),
    imageRoutes         = require("./routes/images"),
    serviceRoutes       = require("./routes/services"),
    testimonialRoutes   = require("./routes/testimonials"),
    contactRoutes       = require("./routes/contacts"),
    aboutRoutes         = require("./routes/abouts"),
    bookingRoutes       = require("./routes/bookings"),
    locationRoutes      = require("./routes/locations"),
    authRoutes          = require("./routes/index");
    

mongoose.connect("mongodb://localhost:27017/senior_project_v3", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
//No need to to ejs extesion anymore
app.set("view engine", "ejs");
// __dirname will return -> /home/ubuntu/workspace/ThinkInsideTheBun/v5
app.use(express.static(__dirname+"/public"));// console.log(__dirname);
app.use(methodOverride("_method"));//this will be used to 'edit' page
app.use(flash());
app.use(expressSanitize());
 //seedDB(); //seed database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Just think inside the bun",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// below three mothods come with passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//middileware
//this function will be called in every route
app.use(function(req, res, next){
    //req.user will be null if no  one is login
    res.locals.currentUser  = req.user; //currentUser will be used in js files
    res.locals.error        = req.flash("error"); //show errors 
    res.locals.success      = req.flash("success"); //flash success
    next();
});

app.use(authRoutes);
app.use("/images",imageRoutes);
app.use("/images/:id/comments",commentRoutes);
app.use("/services",serviceRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/contacts", contactRoutes);
app.use("/abouts", aboutRoutes);
app.use("/bookings", bookingRoutes);
app.use("/locations", locationRoutes);
//


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});