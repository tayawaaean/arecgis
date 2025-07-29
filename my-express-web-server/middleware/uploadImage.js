const multer = require('multer');

const uploadImage = (req,res,next)=>{
  
const upload = multer().array('myUploads', 3)

  // Here call the upload middleware of multer
  upload(req, res, function (err) {
     if (err instanceof multer.MulterError) {
       // A Multer error occurred when uploading.
       const err = new Error('Image upload error');
       next(err)
       return res.status(400).json({ message: err.message })

       } else if (err) {
       // An unknown error occurred when uploading.
       const err = new Error('Server Error')
       next(err)
       return res.status(400).send({ message: err.message })
     }

    // Everything went fine.
    next()
  })

}

module.exports = uploadImage 