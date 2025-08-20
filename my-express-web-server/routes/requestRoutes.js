const express = require('express')
const router = express.Router()
const requestsController = require('../controllers/requestsController')
const verifyJWT = require('../middleware/verifyJWT')
const checkRoles = require('../middleware/checkRoles')
const multer = require('multer')

// Configure multer for document uploads
const upload = multer()

// Apply JWT verification to all routes
router.use(verifyJWT)

router.route('/')
    .get(checkRoles(['Admin', 'Manager']), requestsController.getAllRequests)
    .post(upload.array('documents', 5), requestsController.createRequest) // Allow up to 5 documents

// Bulk transfer route
router.route('/bulk-transfer')
    .post(upload.array('documents', 5), requestsController.createBulkTransferRequest) // Allow up to 5 documents

router.route('/user')
    .get(requestsController.getUserRequests) // Users can see their own requests

// Notifications route
router.route('/notifications')
    .get(requestsController.getNotifications)

router.route('/:id')
    .get(requestsController.getRequest)

router.route('/:id/approve')
    .patch(checkRoles(['Admin', 'Manager']), requestsController.approveRequest)

router.route('/:id/reject')
    .patch(checkRoles(['Admin', 'Manager']), requestsController.rejectRequest)

// Document download route
router.route('/:id/documents/:documentIndex')
    .get(requestsController.downloadDocument)

module.exports = router
