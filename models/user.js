const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");


var userschema = new mongoose.Schema({
    username: {type: String,unique:true,required:true},
    email: {type: String,unique:true,required:true},
    image:{
        secure_url:{type:String, default:"/images/default-profile.jpg"},
        public_id:String
    },
    bio:String,
    tagline:String,
    firstName:String,
    lastName:String,
    resetPasswordToken:String,
    resetPasswordExpires: Date,
    googleId:String,
    isAdmin:{type:Boolean,default:false},
    isverfied:{type:Boolean,default:false}
})

userschema.plugin(passportlocalmongoose, {
    usernameField: 'email'
  });
module.exports = mongoose.model("User",userschema);