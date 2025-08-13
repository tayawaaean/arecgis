const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const { getInventoryList, getInventoryListSummary } = require('../controllers/inventoryListController')

// Protected routes
router.get('/', verifyJWT, getInventoryList)
router.get('/summary', verifyJWT, getInventoryListSummary)

module.exports = router