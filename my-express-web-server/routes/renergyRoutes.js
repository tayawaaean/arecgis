const express = require('express')
const router = express.Router()
const renergiesController = require('../controllers/renergiesController')
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
    .get(renergiesController.getAllRenergies)
    .post(upload, renergiesController.createNewRenergy)
    .put(upload, renergiesController.deleteImageRenergy)
    .patch(upload, renergiesController.updateRenergy)
    .delete(renergiesController.deleteRenergy)

module.exports = router