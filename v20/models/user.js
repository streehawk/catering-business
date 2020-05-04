var mongoose                = require("mongoose");
var passwordLocalMongoose   = require("passport-local-mongoose");

var UserSchema  = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    isAdmin: {type: Boolean, default: false},
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passwordLocalMongoose);
module.exports  = mongoose.model("User", UserSchema);
