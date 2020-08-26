const mongoose = require("mongoose");
const Comment = require("./comment");
const comment = require("./comment");
const postschema = new mongoose.Schema({
    title:String,
    images:[{url:String,public_id:String}],
    description:String,
    author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    },
    comments:[

        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }

    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps: true});

postschema.pre("remove", async function(){
    await comment.remove({
        _id:{
            $in:this.comments
        }
    })
})

module.exports = mongoose.model("Post",postschema);