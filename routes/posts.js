const express = require('express');
const router = express.Router();
const multer = require("multer");
const {storage} = require("../cloudinary/index")
const upload = multer({storage})
const {errorHandler,isloggedin, isAuthor,isverifiedUser} = require("../middleware/index")
const {newPost,createPost,showPost,getpost,editpost, updatepost,deletepost,likepost} = require("../controllers/post")



/* GET post page. /post */
router.get('/', errorHandler(getpost));
/*  get new post /post/new */
router.get('/new',isloggedin,isverifiedUser,newPost);

/* post create */
router.post('/',isloggedin,isverifiedUser,upload.array('images',4),errorHandler(createPost));

/* get show page /post/:id*/
router.get('/:id', errorHandler(showPost));

/* like post  /post/:id/like */
router.post('/:id/like',isloggedin,isverifiedUser,errorHandler(likepost));

/* get edit post page */
router.get('/:id/edit',isloggedin,errorHandler(isAuthor),errorHandler(editpost));

/*put update post */
router.put('/:id',isloggedin,errorHandler(isAuthor),upload.array("images",4),errorHandler(updatepost));

/* DELETE /post/:id. */
router.delete('/:id',isloggedin,errorHandler(isAuthor),errorHandler(deletepost));  








module.exports = router;
