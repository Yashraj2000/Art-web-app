const Post = require("../models/post");
const {cloudinary} = require("../cloudinary/index")
const htmlToText = require('html-to-text');


module.exports = {
 
    //  async getpost(req,res,next)
    //  {
    //      const posts = await Post.find({},null, {
    //          sort:{"_id":-1}
    //      });
    //      //console.log(posts)
    //      res.render("post/index",{posts})
    //  }
    async getpost(req,res,next)
    {
        const posts = await Post.find({}).populate([
            {
            path:"likes"
           },{
               path:"author"
           }
    ]).sort({_id:-1});
       //    console.log(posts)
       for(const post of posts)
       {   
           post.description = htmlToText.fromString(post.description,{
            ignoreImage:true,
            ignoreHref:true
           });
       }
        res.render("post/index",{posts})
    }

    ,
     newPost(req,res,next){
         res.render("post/new")
     },
   async createPost(req,res,next){
       //console.log(req.body)
     req.body.post.images = []
    for(const file of req.files)
           {
               req.body.post.images.push({
                   url:file.path,
                   public_id:file.filename
               })
           } 
        req.body.post.author = req.user._id; 
       const post = await Post.create(req.body.post);
       //console.log(post)
       req.session.success = "Post created successfully"
       res.redirect(`/post/${post._id}`);
   },
   async showPost(req,res,next)
   {  
       if(req.params.id.length==24){   
      var currentpage = req.query.currentpage || 1;  
      var post = await Post.findById(req.params.id).populate([
          {
              path:"comments",
              options:{sort:{_id:-1},skip:(currentpage-1)*2,limit:2},
              populate:{
                  path:"author",
                  model:"User"
              }
          },
          {
              path:"likes"
          },
          {
              path:"author"
          }
    
    ]);
    if(req.xhr)
    {
        return res.status(200).send(post);
    }
    var temp = await Post.findById(req.params.id);
    var reviewslength = temp.comments.length;
     return res.render("post/show",{post,reviewslength});
}
  req.session.error = "No blog matched your query";
  return res.redirect("/post");
   },
//    async showPost(req,res,next)
//    {
//       var post = await Post.findById(req.params.id).populate({
//           path:"comments",
//           options:{sort:{_id:-1}},
//           populate:{
//               path:"author",
//               model:"User"
//           }
//       })
//      // console.log(post)
//       res.render("post/show",{post});
//    },
   async editpost(req,res,next){
       console.log("here",req.params.id.length);
    if(req.params.id.length===24){
       const post = await Post.findById(req.params.id);
      return res.render("post/edit",{post});
    }
    req.session.error = "Sorry No blog Matched Your query";
    return res.redirect("/post");
   },
   async updatepost(req,res,next)
   {  
    if(req.params.id.length===24){
      const post = await Post.findById(req.params.id);
      //console.log(req.body.deleteimage)
      if(req.body.deleteimage && req.body.deleteimage.length>0)
      {
          for(const public_id of req.body.deleteimage)
          {
              await cloudinary.uploader.destroy(public_id);
              for(const img of post.images)
              {
                  if(img.public_id===public_id)
                  {
                    let index = post.images.indexOf(img);
                    post.images.splice(index,1);
                  }
              }

          }
      }
      if(req.files)
      {
          for (const file of req.files) {
              // let image = await cloudinary.uploader.upload(file.path);
              post.images.push({
                  url: file.path,
                  public_id:file.filename
              })
          }  
      } 
      post.title = req.body.newpost.title  
      post.description = req.body.newpost.description;
      await post.save();
     return res.redirect(`/post/${post._id}`)  
    }
    req.session.error = "Sorry No blog Matched Your query";
    return res.redirect("/post");
   },
   async deletepost(req,res,next){
    let posts =  await Post.findById(req.params.id);
    for(const images of posts.images)
    {
      await cloudinary.uploader.destroy(images.public_id);   
    } 
    /* when we are deleting post we want to remove all the reviews assocaited with it for that we use prehook middleware inside the post model which will be invoked once .remove() is called */
      await posts.remove();  
      req.session.success = "Post Deleted" 
      res.redirect("/post")
  },
  async likepost(req,res,next){
      const post = await Post.findById(req.params.id).populate({
          path:"likes",
          options:{sort:{_id:-1}}
        });
 
     let foundpost = post.likes.some(function(like){
         return like._id.equals(req.user._id);
     });

     if(foundpost)
     {
         post.likes.pull({_id:req.user._id});
     }else{
         post.likes.push(req.user);
     }
     await post.save();
     return res.send(post);
  }

}