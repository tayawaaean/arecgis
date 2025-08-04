const express = require('express')
const router = express.Router()
const multer = require('multer')
const transfersController = require('../controllers/transfersController')
const verifyJWT = require('../middleware/verifyJWT')

// Inline role checker function
const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(403).json({ message: 'Forbidden' });

        const rolesArray = [...allowedRoles];
        
        // Check if req.roles is an array or object
        let authorized = false;
        
        if (Array.isArray(req.roles)) {
            // Check if any of the user's roles match any allowed roles
            authorized = rolesArray.some(role => req.roles.includes(role));
        } else if (typeof req.roles === 'object') {
            // Check if any of the user's roles (as object properties) match any allowed roles
            authorized = rolesArray.some(role => req.roles[role]);
        }
        
        if (!authorized) {
            return res.status(403).json({ message: 'Forbidden - Insufficient role permissions' });
        }
        
        next();
    }
}

// Configure multer for memory storage (needed for base64 conversion)
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
        // Accept images, PDFs, and common document formats
        const allowedTypes = [
            'image/jpeg', 
            'image/png', 
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File type not supported. Please upload images, PDFs, or documents.'))
        }
        
        cb(null, true)
    }
})

// Apply JWT verification to all routes
router.use(verifyJWT)

// Create new transfer request
router.post(
    '/',
    upload.array('documents', 5),
    transfersController.createTransfer
)

// IMPORTANT: Put specific routes with fixed path segments BEFORE routes with parameters
// Check for existing transfers for an inventory (more specific route)
router.get('/check/:inventoryId', transfersController.checkExistingTransfers)

// Get user's own transfers
router.get('/user', transfersController.getUserTransfers)

// Get specific user's transfers (Admin/Manager only)
router.get(
    '/user/:userId',
    checkRoles('Admin', 'Manager'),
    transfersController.getUserTransfersById
)

// All transfers (Admin/Manager only) - needs to be before /:id route
router.get(
    '/',
    checkRoles('Admin', 'Manager'),
    transfersController.getAllTransfers
)

// NEW ROUTE: Get a single transfer by ID
router.get('/:id', transfersController.getTransferById)

// Get document from transfer 
router.get('/:id/documents/:docId', transfersController.getTransferDocument)

// Approve a transfer (Admin/Manager only)
router.patch(
    '/:id/approve',
    checkRoles('Admin', 'Manager'),
    transfersController.approveTransfer
)

// Reject a transfer (Admin/Manager only)
router.patch(
    '/:id/reject',
    checkRoles('Admin', 'Manager'),
    transfersController.rejectTransfer
)

// Delete a transfer (Admin only)
router.delete(
    '/:id',
    checkRoles('Admin'),
    transfersController.deleteTransfer
)

module.exports = router