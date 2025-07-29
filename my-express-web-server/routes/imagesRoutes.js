const express = require('express')
const router = express.Router()
const imagesController = require('../controllers/imagesController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/:id', ).get(imagesController.getImage)
router.route('/mobile/:id', ).get(imagesController.getMobile)
router.route('/del/:id', ).delete(imagesController.deleteImage)
    

module.exports = router