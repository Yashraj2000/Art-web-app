const express = require('express');
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const {storage} = require("../cloudinary/index")
const upload = multer({storage})
const {errorHandler,isvalidPassword,changePassword,isloggedin} = require("../middleware/index")
const {emailverification,getresendPage,resendEmail,profilecheck,googlelogin,getRegister,getLogin,postregister,getlogout,postlogin,userprofile,getprofile,updateProfile,getForgotpwd,putforgotPwd,getReset,putReset}  = require("../controllers/index")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* get register */
router.get('/register', getRegister);

/* post register */
router.post('/register', errorHandler(postregister));

/* get login */
router.get('/login',getLogin);

/* post login */
router.post('/login', errorHandler(postlogin));

/* get logout */

router.get('/logout', getlogout);

router.post("/profile/check",errorHandler(profilecheck))

/* get public  profile */
router.get('/user/:id',errorHandler(userprofile));


/* get profile dashboard*/
router.get('/profile',isloggedin,getprofile);

/* put profile */
router.put('/profile',isloggedin,upload.single("image"),errorHandler(isvalidPassword),errorHandler(changePassword),errorHandler(updateProfile));


/* get Forgot-pwd */
router.get('/forgot-password',getForgotpwd);

/* put Forgot-pwd */
router.put('/forgot-password',errorHandler(putforgotPwd));

/* get reset-token */
router.get('/reset/:token',errorHandler(getReset));

/* put reset-tooken */
router.put('/reset/:token',errorHandler(putReset));

  // This code will take use to consent screen
router.get("/login/google",passport.authenticate("google",{
  scope:[        'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email']
}));

router.get("/login/google/callback",errorHandler(googlelogin));

// resened Email 
router.get("/verify-email/:id",errorHandler(emailverification));
router.get("/resend-page",isloggedin,errorHandler(getresendPage));
router.get("/resend-email",isloggedin,errorHandler(resendEmail));












module.exports = router;
