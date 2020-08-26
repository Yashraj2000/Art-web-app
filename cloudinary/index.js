const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;   
  cloudinary.config({ 
      cloud_name: "banka-raj00", 
      api_key: "762911423588564",
      api_secret: process.env.CLOUDINARY_SECRET 
    });

  const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // this is the cloudinary we have configured above
  folder: 'photo-app', // name of folder inside cloudinary where our images will be stored
  allowedFormats: ['jpeg', 'jpg', 'png'],
  filename: function (file,options,cb) {
      let buf = crypto.randomBytes(16);
      console.log('this is buffer');
      console.log(buf,'This is buffer');
  	buf = buf.toString('hex');
  	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
      uniqFileName += buf;
      console.log(uniqFileName)
    cb(undefined, uniqFileName );
  }
});

module.exports = {
	cloudinary,
	storage
}