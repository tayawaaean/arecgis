const express = require('express')
const router = express.Router()
const publicInventoriesController = require('../controllers/publicInventoriesController')


router.route('/', )
    .get(publicInventoriesController.getAllPublicInventories)


module.exports = router