const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const inventoriesController = require('../controllers/inventoriesController')
const verifyJWT = require('../middleware/verifyJWT')
const sharp = require('sharp');
const uploadImage = require('../middleware/uploadImage')
// 
router.use(verifyJWT)

// var multer = require("multer")
// const upload = multer().array('myUploads', 3)


router.route('/',)
    .get(inventoriesController.getAllInventories)
    .post(uploadImage, inventoriesController.createNewInventory)
    .put(uploadImage, inventoriesController.deleteImageInventory)
    .patch(uploadImage, inventoriesController.updateInventory)
    .delete(inventoriesController.deleteInventory)

module.exports = router