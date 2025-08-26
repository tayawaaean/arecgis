const Request = require('../models/Request')
const User = require('../models/User')
const Inventory = require('../models/Inventory')
const bcrypt = require('bcrypt')

// Helper function to check user roles
const hasRole = (user, roleName) => {
    if (user.roles && Array.isArray(user.roles)) {
        return user.roles.includes(roleName);
    }
    return false;
}

// @desc Create a new request (transfer or account deletion)
// @route POST /requests
// @access Private
const createRequest = async (req, res) => {
    const { requestType, inventoryId, reason, password } = req.body

    // Validate request body
    if (!requestType || !reason || !password) {
        return res.status(400).json({ message: 'Request type, reason, and password are required' })
    }

    // Validate request type
    if (!['transfer', 'account_deletion'].includes(requestType)) {
        return res.status(400).json({ message: 'Invalid request type' })
    }

    // For transfer requests, inventory ID is required
    if (requestType === 'transfer' && !inventoryId) {
        return res.status(400).json({ message: 'Inventory ID is required for transfer requests' })
    }

    // For transfer requests, documents are required
    if (requestType === 'transfer' && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ message: 'Supporting documents are required for transfer requests' })
    }

    try {
        // Get current user by username from JWT
        const username = req.user
        const currentUser = await User.findOne({ username }).exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        // Verify user's password
        const isPasswordValid = await bcrypt.compare(password, currentUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        let inventory = null;
        
        // For transfer requests, validate inventory ownership
        if (requestType === 'transfer') {
            inventory = await Inventory.findById(inventoryId)
            if (!inventory) {
                return res.status(404).json({ message: 'Inventory not found' })
            }

            // Users can request to transfer any inventory to themselves

            // Check if there's already a pending transfer request for this inventory
            const existingTransferRequest = await Request.findOne({
                requestType: 'transfer',
                inventoryId: inventoryId,
                status: 'pending'
            })

            if (existingTransferRequest) {
                return res.status(400).json({ message: 'There is already a pending transfer request for this inventory' })
            }
        }

        // For account deletion, check if there's already a pending request
        if (requestType === 'account_deletion') {
            const existingDeletionRequest = await Request.findOne({
                requestType: 'account_deletion',
                requesterId: currentUser._id,
                status: 'pending'
            })

            if (existingDeletionRequest) {
                return res.status(400).json({ message: 'You already have a pending account deletion request' })
            }
        }

        // Create document objects if files are provided
        const documents = req.files ? req.files.map(file => ({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            data: file.buffer.toString('base64')
        })) : [];

        // Create new request
        const request = await Request.create({
            requestType,
            requesterId: currentUser._id,
            inventoryId: requestType === 'transfer' ? inventoryId : undefined,
            documents,
            reason,
            username: currentUser.username // Store username directly for easier access
        })

        if (request) {
            return res.status(201).json({
                message: `${requestType === 'transfer' ? 'Transfer' : 'Account deletion'} request created successfully`,
                requestId: request._id
            })
        } else {
            return res.status(400).json({ message: 'Invalid request data received' })
        }
    } catch (error) {
        console.error('Error in createRequest:', error)
        return res.status(500).json({ message: 'Error creating request', error: error.message })
    }
}

// @desc Create a bulk transfer request for multiple inventories
// @route POST /requests/bulk-transfer
// @access Private
const createBulkTransferRequest = async (req, res) => {
    const { inventoryIds, reason, password } = req.body

    // Validate request body
    if (!inventoryIds || !reason || !password) {
        return res.status(400).json({ message: 'Inventory IDs, reason, and password are required' })
    }

    // Validate inventoryIds is an array
    if (!Array.isArray(inventoryIds) || inventoryIds.length === 0) {
        return res.status(400).json({ message: 'Inventory IDs must be a non-empty array' })
    }

    // Limit bulk transfers to reasonable number (e.g., 10 inventories max)
    if (inventoryIds.length > 10) {
        return res.status(400).json({ message: 'Cannot transfer more than 10 inventories at once' })
    }

    // For bulk transfer requests, documents are required
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Supporting documents are required for bulk transfer requests' })
    }

    try {
        // Get current user by username from JWT
        const username = req.user
        const currentUser = await User.findOne({ username }).exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        // Verify user's password
        const isPasswordValid = await bcrypt.compare(password, currentUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        // Validate all inventories exist
        const inventories = await Inventory.find({ _id: { $in: inventoryIds } }).exec()
        if (inventories.length !== inventoryIds.length) {
            return res.status(404).json({ message: 'One or more inventories not found' })
        }

        // Check if there are already pending transfer requests for any of these inventories
        const existingTransferRequests = await Request.find({
            requestType: 'transfer',
            inventoryId: { $in: inventoryIds },
            status: 'pending'
        })

        if (existingTransferRequests.length > 0) {
            const conflictingInventories = existingTransferRequests.map(req => req.inventoryId)
            return res.status(400).json({ 
                message: 'There are already pending transfer requests for some inventories',
                conflictingInventories
            })
        }

        // Create document objects
        const documents = req.files.map(file => ({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            data: file.buffer.toString('base64')
        }))

        // Create bulk transfer request
        const bulkTransferRequest = await Request.create({
            requestType: 'bulk_transfer',
            requesterId: currentUser._id,
            inventoryIds: inventoryIds, // Store array of inventory IDs
            reason,
            documents,
            status: 'pending'
        })

        if (bulkTransferRequest) {
            res.status(201).json({
                message: `Bulk transfer request created successfully for ${inventoryIds.length} inventories`,
                requestId: bulkTransferRequest._id,
                inventoryCount: inventoryIds.length
            })
        } else {
            res.status(400).json({ message: 'Invalid bulk transfer data received' })
        }
    } catch (error) {
        console.error('Error in createBulkTransferRequest:', error)
        res.status(500).json({ message: 'Error creating bulk transfer request', error: error.message })
    }
}

// @desc Get all requests
// @route GET /requests
// @access Private (Admin/Manager only)
const getAllRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '', requestType = '' } = req.query
        
        // Build filter object
        const filter = {}
        if (status) filter.status = status
        if (requestType) filter.requestType = requestType

        const requests = await Request.find(filter)
            .populate('requesterId', 'username fullName')
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.reClass properties.address username')
            .populate('inventoryIds', 'properties.ownerName properties.reCat properties.reClass properties.address username')
            .populate('reviewedBy', 'username fullName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const total = await Request.countDocuments(filter)

        res.json({
            data: requests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        })
    } catch (error) {
        console.error('Error in getAllRequests:', error)
        res.status(500).json({ message: 'Error fetching requests', error: error.message })
    }
}

// @desc Get user's own requests
// @route GET /requests/user
// @access Private
const getUserRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '', requestType = '' } = req.query
        const username = req.user
        
        // Get current user
        const currentUser = await User.findOne({ username }).lean().exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        // Build filter object
        const filter = { requesterId: currentUser._id }
        if (status) filter.status = status
        if (requestType) filter.requestType = requestType

        const requests = await Request.find(filter)
            .populate('requesterId', 'username fullName')
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.reClass properties.address')
            .populate('inventoryIds', 'properties.ownerName properties.reCat properties.reClass properties.address')
            .populate('reviewedBy', 'username fullName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const total = await Request.countDocuments(filter)

        res.json({
            data: requests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        })
    } catch (error) {
        console.error('Error in getUserRequests:', error)
        res.status(500).json({ message: 'Error fetching user requests', error: error.message })
    }
}

// @desc Get a single request by ID
// @route GET /requests/:id
// @access Private
const getRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('requesterId', 'username fullName')
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.reClass properties.address username')
            .populate('inventoryIds', 'properties.ownerName properties.reCat properties.reClass properties.address username')
            .populate('reviewedBy', 'username fullName')
            .exec()

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        res.json(request)
    } catch (error) {
        console.error('Error in getRequest:', error)
        res.status(500).json({ message: 'Error fetching request', error: error.message })
    }
}

// @desc Approve a request
// @route PATCH /requests/:id/approve
// @access Private (Admin/Manager only)
const approveRequest = async (req, res) => {
    try {
        const { notes, password } = req.body
        const username = req.user
        
        console.log('Approve request called with:', { notes, hasPassword: !!password, username })
        
        // Get current user (admin/manager)
        const currentUser = await User.findOne({ username }).exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        // Verify admin/manager's password
        if (!password) {
            return res.status(400).json({ message: 'Password is required for approval' })
        }
        
        const isPasswordValid = await bcrypt.compare(password, currentUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        const request = await Request.findById(req.params.id)
            .populate('requesterId', 'username fullName')
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.reClass properties.address username')
            .exec()

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been processed' })
        }

        // Handle different request types
        if (request.requestType === 'transfer') {
            // For transfer requests, transfer the inventory to the requester
            const inventory = await Inventory.findById(request.inventoryId)
            if (!inventory) {
                return res.status(404).json({ message: 'Inventory not found' })
            }

            // Add current owner to previousUsers array
            if (!inventory.previousUsers.includes(inventory.user)) {
                inventory.previousUsers.push(inventory.user)
            }

            // Transfer ownership to the requester
            inventory.user = request.requesterId._id
            await inventory.save()

        } else if (request.requestType === 'bulk_transfer') {
            // For bulk transfer requests, transfer all inventories to the requester
            if (!request.inventoryIds || request.inventoryIds.length === 0) {
                return res.status(400).json({ message: 'No inventory IDs found for bulk transfer' })
            }

            const inventories = await Inventory.find({ _id: { $in: request.inventoryIds } }).exec()
            if (inventories.length !== request.inventoryIds.length) {
                return res.status(404).json({ message: 'One or more inventories not found for bulk transfer' })
            }

            // Transfer ownership for all inventories
            for (const inventory of inventories) {
                // Add current owner to previousUsers array
                if (!inventory.previousUsers.includes(inventory.user)) {
                    inventory.previousUsers.push(inventory.user)
                }
                // Transfer ownership to the requester
                inventory.user = request.requesterId._id
                await inventory.save()
            }

        } else if (request.requestType === 'account_deletion') {
            // For account deletion, set the user account as inactive (don't delete data)
            const userToDeactivate = await User.findById(request.requesterId._id)
            if (userToDeactivate) {
                userToDeactivate.active = false
                await userToDeactivate.save()
            }
        }

        // Update request status
        request.status = 'approved'
        request.reviewedBy = currentUser._id
        request.reviewDate = new Date()
        if (notes) request.notes = notes

        await request.save()

        // Email notifications will be handled by the frontend

        let message = ''
        if (request.requestType === 'transfer') {
            message = 'Transfer request approved successfully'
        } else if (request.requestType === 'bulk_transfer') {
            message = `Bulk transfer request approved successfully for ${request.inventoryIds.length} inventories`
        } else if (request.requestType === 'account_deletion') {
            message = 'Account deactivation request approved successfully'
        }

        res.json({ 
            message,
            request 
        })
    } catch (error) {
        console.error('Error in approveRequest:', error)
        res.status(500).json({ message: 'Error approving request', error: error.message })
    }
}

// @desc Reject a request
// @route PATCH /requests/:id/reject
// @access Private (Admin/Manager only)
const rejectRequest = async (req, res) => {
    try {
        const { notes, password, rejectionReason } = req.body
        const username = req.user
        
        console.log('Reject request called with:', { notes, hasPassword: !!password, username })
        
        // Get current user (admin/manager)
        const currentUser = await User.findOne({ username }).exec()
        if (!currentUser) {
            return res.status(400).json({ message: 'User not found' })
        }

        // Verify admin/manager's password
        if (!password) {
            return res.status(400).json({ message: 'Password is required for rejection' })
        }
        
                const isPasswordValid = await bcrypt.compare(password, currentUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been processed' })
        }

        // Update request status
        request.status = 'rejected'
        request.reviewedBy = currentUser._id
        request.reviewDate = new Date()
        if (notes) request.notes = notes
        if (rejectionReason) request.rejectionReason = rejectionReason

        await request.save()

        // Email notifications will be handled by the frontend

        let message = ''
        if (request.requestType === 'transfer') {
            message = 'Transfer request rejected'
        } else if (request.requestType === 'bulk_transfer') {
            message = `Bulk transfer request rejected for ${request.inventoryIds?.length || 0} inventories`
        } else if (request.requestType === 'account_deletion') {
            message = 'Account deactivation request rejected'
        }

        res.json({ 
            message,
            request 
        })
    } catch (error) {
        console.error('Error in rejectRequest:', error)
        res.status(500).json({ message: 'Error rejecting request', error: error.message })
    }
}

// @desc Download a document from a request
// @route GET /requests/:id/documents/:documentIndex
// @access Private
const downloadDocument = async (req, res) => {
    try {
        const { id, documentIndex } = req.params;
        
        // Find the request
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        
        // Check if document index is valid
        const docIndex = parseInt(documentIndex);
        if (isNaN(docIndex) || docIndex < 0 || docIndex >= request.documents.length) {
            return res.status(400).json({ message: 'Invalid document index' });
        }
        
        const document = request.documents[docIndex];
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        
        // Convert base64 back to buffer
        const buffer = Buffer.from(document.data, 'base64');
        
        // Set response headers for file download
        res.setHeader('Content-Type', document.type);
        res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
        res.setHeader('Content-Length', document.size);
        
        // Send the file
        res.send(buffer);
        
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ message: 'Error downloading document', error: error.message });
    }
}

// @desc Get notifications for user based on role
// @route GET /requests/notifications
// @access Private
const getNotifications = async (req, res) => {
    try {
        const username = req.user
        const currentUser = await User.findOne({ username }).exec()
        
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        const isAdmin = hasRole(currentUser, 'Admin')
        const isManager = hasRole(currentUser, 'Manager')
        const isInstaller = hasRole(currentUser, 'Installer')
        const isEmployee = hasRole(currentUser, 'Employee')

        let query = {}
        let limit = 3 // Only show 3 notifications

        if (isAdmin || isManager) {
            // Admin/Manager sees pending requests
            query.status = 'pending'
        } else if (isInstaller || isEmployee) {
            // Installer/Employee sees their own accepted/rejected requests
            query.requesterId = currentUser._id
            query.status = { $in: ['approved', 'rejected'] }
        } else {
            // Other roles see their own requests
            query.requesterId = currentUser._id
        }

        const notifications = await Request.find(query)
            .populate('requesterId', 'username fullName') // Keep this for backward compatibility with existing records
            .populate('inventoryId', 'properties.ownerName properties.address')
            .populate('inventoryIds', 'properties.ownerName properties.address')
            .populate('reviewedBy', 'username fullName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()

        // Transform the data for frontend
        const transformedNotifications = notifications.map(notification => {
            let inventoryName = null
            let inventoryLocation = null
            
            if (notification.requestType === 'bulk_transfer' && notification.inventoryIds) {
                // For bulk transfers, show count and first inventory details
                inventoryName = `${notification.inventoryIds.length} Inventories (Bulk Transfer)`
                if (notification.inventoryIds.length > 0) {
                    inventoryLocation = notification.inventoryIds[0]?.properties?.address || null
                }
            } else if (notification.inventoryId) {
                // For single transfers
                inventoryName = notification.inventoryId.properties?.ownerName || 'Inventory'
                inventoryLocation = notification.inventoryId.properties?.address || null
            }
            
            return {
                id: notification._id,
                requestType: notification.requestType,
                status: notification.status,
                reason: notification.reason,
                createdAt: notification.createdAt,
                requesterName: notification.username || // Use direct username field if available (new records)
                    (notification.requesterId?.username) || // Fall back to populated username (existing records)
                    'Unknown User',
                inventoryName,
                inventoryLocation,
                reviewedByName: notification.reviewedBy ? 
                    (notification.reviewedBy.fullName || notification.reviewedBy.username || 'Admin') : 
                    null,
                reviewDate: notification.reviewDate,
                notes: notification.notes,
                rejectionReason: notification.rejectionReason
            };
        })

        res.json({
            notifications: transformedNotifications,
            total: transformedNotifications.length,
            hasMore: await Request.countDocuments(query) > limit
        })

    } catch (error) {
        console.error('Error fetching notifications:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    createRequest,
    createBulkTransferRequest,
    getAllRequests,
    getUserRequests,
    getRequest,
    approveRequest,
    rejectRequest,
    downloadDocument,
    getNotifications
}
