const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const { getInventoryList } = require('../controllers/inventoryListController')

// Protected route
router.get('/', verifyJWT, getInventoryList)

module.exports = router