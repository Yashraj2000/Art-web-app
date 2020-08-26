const Comment = require("../models/comment");
const Post = require("../models/post");
module.exports={

async createcomment(req,res,next){
    try {
        var post = await Post.findById(req.params.id).populate({
            path:"comments",
            populate:{
                path:'author',
                model:"User"
            }
        })
        req.body.newcomment.author = req.user;
        const comment = await Comment.create(req.body.newcomment);
        post.comments.push(comment);
        await post.save();
        // req.session.success = "Review created successfully";
        // console.log(post.comments)
        res.send(post);
        // res.redirect(`/post/${post._id}`);
    } catch (err) {
        return res.status(400).send(err);
    }

},

async editcomment(req,res,next){
    try{
        // console.log(req.body.newcomment)
       var com =  await Comment.findById(req.params.comment_id);
       com.comment = req.body.newcomment.comment;
      await com.save();
    //    console.log(com)
        // req.session.success="Updated successfully"
        // res.redirect(`/post/${req.params.id}`);
        res.send(com);
    }catch(err){
        return res.status(400).send(err);
    }
},

async deletecomment(req,res,next){
    try{
      var posts =   await Post.findByIdAndUpdate(req.params.id,{
            $pull:{comments:req.params.comment_id}
        },{new:true});
        await Comment.findByIdAndRemove(req.params.comment_id); // This will only remove from the collection but will still be present in post database to remove from post 
        // req.session.success = "Review deleted successfully"
        console.log(posts,"in delete")
         return res.status(200).json({"length":posts.comments.length})
    }catch(err){
        return res.status(400).send(err);
    }
 
}







}
