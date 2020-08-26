const mongoose = require("mongoose");


const commentschema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
       },
       comment: String
},{timestamps: true});
module.exports = mongoose.model("Comment", commentschema);