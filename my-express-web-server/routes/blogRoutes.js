const express = require('express')
const router = express.Router()
const blogsController = require('../controllers/blogsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

var multer = require("multer")
const path = require('path')

const Storage = multer.diskStorage({
    destination: './public/uploads/postimages/',
    filename: (req, file, cb)=>{
        cb(null, file.fieldname + "-" + Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: Storage
}).array('myUploads', 12)




router.route('/', )
    .get(blogsController.getAllBlogs)
    .post(upload, blogsController.createNewBlog)
    .put(upload, blogsController.deleteImageBlog)
    .patch(upload, blogsController.updateBlog)
    .delete(blogsController.deleteBlog)

module.exports = router