require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const engine  = require("ejs-mate");
const passport = require("passport");
const favicon = require('serve-favicon');
const googlestrategy = require("passport-google-oauth2").Strategy;
const passportlocalmongoose = require("passport-local-mongoose");




// require models
var User = require("./models/user")


// Requiring Routes
var indexRouter = require('./routes/index');
var commentsRouter = require('./routes/comments');
var postsRouter = require('./routes/posts');
const user = require('./models/user');

var app = express();

// connecting databse 
var url = process.env.DATABASE_URL || 'mongodb://localhost:27017/photo-app';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:false });
var db = mongoose.connection;
db.on('error',console.error.bind(console,"conncetion error"));
db.once('open',function(){
  console.log("connected")
})

// use ejs-locals/mate for all the ejs template
app.engine("ejs",engine);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodoverride("_method"))


// passport configuration
app.use(session({
  secret: "This can be anyting",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.use(new googlestrategy({
  clientID:process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/login/google/callback"
                
},async (accessToken,refreshToken,profile,done)=>{
  console.log(profile);
  //  whenever it code will come here and user is found it will pass it on to the serialise user
  // This done callback will attach user to req.user object
    const userpresent = await User.findOne({googleId:profile.id})
    if(userpresent){
      // menas we will pass tht user to serialise it so that we can extract all the DATA AND stor eit inside a session for later use
     return done(null,userpresent)
    }else{
      const users = await User.findOne({email:profile._json.email})
      if(users)
      {
        return done({error:"Primary email already registered"})
      }
      var newuser = new User({
        googleId:profile.id,
        firstName:profile.given_name,
        lastName:profile.family_name,
        username:profile.displayName,
        image:{
          secure_url:profile._json.picture,
          public_id:profile._json.sub
        },
        email:profile._json.email
      })
      user.isverified = true;
     await newuser.save();
     return done(null,newuser)

    }

}));





passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware / local variable this should come before any route you render
app.use(function(req,res,next){
  // req.user ={ "_id" :"5ee650f97e27d4403020dfee", "username" : "yash"}
  // req.user ={ "_id" :"5eeafdb35a048743f47bf130", "username" : "yash3"}
  app.locals.moment = require('moment');
  res.locals.currentUser = req.user;
  res.locals.title = 'photo-app';
  res.locals.success = req.session.success || "";
  delete req.session.success;
  res.locals.error = req.session.error || "";
  delete req.session.error;
  next();
})


// Mounting routes
app.use('/', indexRouter);
app.use("/post",postsRouter);
app.use("/post/:id/comments",commentsRouter);

















// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  if(err.message === "getaddrinfo ENOTFOUND api.cloudinary.com")
    err.message = "Something went wrong Please try again later"
  req.session.error = err.message;
  res.redirect("back");
});

module.exports = app;
