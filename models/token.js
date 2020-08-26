const mongoose = require("mongoose");
const tokenschema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    token:{type:String, required:true},
    createdat:{type:Date,required:true, default:Date.now, expires:4300}
});

// Whole model will expire after 4300 s
module.exports = mongoose.model("Token",tokenschema)