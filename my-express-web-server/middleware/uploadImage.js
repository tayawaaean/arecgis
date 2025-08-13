const multer = require('multer');

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB per file
const MAX_FILE_COUNT = 3

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed'))
  }
  cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILE_COUNT },
  fileFilter
}).array('myUploads', MAX_FILE_COUNT)

const uploadImage = (req,res,next)=>{
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      const error = new Error('Image upload error')
      error.status = 400
      return next(error)
    } else if (err) {
      const error = new Error(err.message || 'Server Error')
      error.status = 400
      return next(error)
    }
    next()
  })
}

module.exports = uploadImage 