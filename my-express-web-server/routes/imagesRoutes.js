const express = require('express')
const router = express.Router()
const imagesController = require('../controllers/imagesController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/:id', ).get(imagesController.getImage)
router.route('/mobile/:id', ).get(imagesController.getMobile)
// Protect destructive action
router.route('/del/:id', ).delete(verifyJWT, imagesController.deleteImage)
    

module.exports = router