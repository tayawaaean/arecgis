const express = require('express')
const router = express.Router()
const inventoriesController = require('../controllers/inventoriesController')
const verifyJWT = require('../middleware/verifyJWT')
const uploadImage = require('../middleware/uploadImage')

router.use(verifyJWT)

router.route('/')
    .get(inventoriesController.getAllInventories)
    .post(uploadImage, inventoriesController.createNewInventory)
    .put(uploadImage, inventoriesController.deleteImageInventory)
    .patch(uploadImage, inventoriesController.updateInventory)
    .delete(inventoriesController.deleteInventory)

module.exports = router