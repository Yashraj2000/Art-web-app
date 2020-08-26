let User = require("../models/user")
let Post = require("../models/post");
let Comment = require("../models/comment");
const {cloudinary} = require("../cloudinary/index")

const middleware = {
  
    errorHandler: (fn) => (req, res, next)=>Promise.resolve(fn(req,res,next)).catch(next),   
    isloggedin: (req,res,next)=>{
        if(req.isAuthenticated()){
          return next()};
        req.session.error = "You need to login to do that";
        req.session.redirectTo = req.originalUrl; 
        res.redirect("/login");
      },
      iscommentauthor: async (req,res,next)=>{
        try {
          let comment =  await Comment.findById(req.params.comment_id);
          // console.log(comment)
            if(comment.author.equals(req.user._id))
              return next();
        } catch (err) {
          return res.status(400).send(err);
        }

          // req.session.error = "You are not authorised";
          // return res.redirect("/");
          // res.send(false)
      },
      isAuthor: async (req,res,next)=>{
        if(req.params.id.length === 24){
        const post = await Post.findById(req.params.id);
        if(post.author.equals(req.user._id)|| (req.user.isAdmin))
        {    
          res.locals.posts = post;
          return next();
        }
        req.session.error = "Access denied";
        return res.redirect("back");
      }
      req.session.error = "Sorry No Blog Matched Your query";
      return res.redirect("back");
      },
      isvalidPassword: async (req,res,next)=>{
        if(req.user.googleId!=undefined)
        {
          res.locals.user = req.user
         return next();
        }
        
        const {user} = await User.authenticate()(req.user.email,req.body.currentPassword)
        if(user)
        {
          res.locals.user = user
          next();
        }else{
           middleware.deleteProfileImage(req);
          req.session.error = "Incorrect Current Password";
          return res.redirect("/profile");
        }
      },
  
      changePassword: async (req,res,next)=>{
        if(req.user.googleId!=undefined)
        {
          res.locals.user = req.user
         return next();
        }
        const {newPassword,passwordConfirmation} = req.body;
        if(newPassword && passwordConfirmation)
        {// means user entered password to change
          const {user} = res.locals;
          if(newPassword.length<6)
          {
            let error;
            error="Password must be 6 digit long"
            return res.render("profile",{error});
          }
          if(newPassword === passwordConfirmation)
          {
            await user.setPassword(newPassword);
            next();
          }else{
            middleware.deleteProfileImage(req);
            req.session.error = "Password must match";
            return res.redirect("/profile");
          }
        }else{
          next();
        }
      },
  
      deleteProfileImage: async req=>{
        if(req.file)
        {
          console.log(req.file,"deleting")
          await cloudinary.uploader.destroy(req.file.path)
        }
      },
      isverifiedUser(req,res,next){
        if(req.user.isverfied || req.user.googleId)
        {
          return next();
        }
        req.session.error = "You Need To verify Your Email to Create a New Post :)";
        return res.redirect("/resend-page");
      }
};









module.exports = middleware;