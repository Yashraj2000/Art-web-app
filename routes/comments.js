const express = require('express');
const router = express.Router({mergeParams:true});
const multer = require("multer");
const {errorHandler,iscommentauthor,isloggedin} = require("../middleware/index")
const {createcomment,editcomment,deletecomment} = require("../controllers/comment")



/* review create */
// jo you are already registered hai yaha se error aa raha hai
router.post('/', isloggedin,errorHandler(createcomment));

/* review update*/
router.put('/:comment_id',isloggedin,iscommentauthor,errorHandler(editcomment));

/* delete review */
router.delete('/:comment_id',isloggedin,iscommentauthor,errorHandler(deletecomment));

module.exports = router;
