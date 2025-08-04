const Transfer = require('../models/Transfer')
const User = require('../models/User')
const Inventory = require('../models/Inventory')

// Helper function to check roles
const hasRole = (roles, roleName) => {
    if (Array.isArray(roles)) {
        return roles.includes(roleName);
    } else if (typeof roles === 'object') {
        return roles[roleName];
    }
    return false;
}

// @desc Create a new transfer request
// @route POST /transfers
// @access Private
const createTransfer = async (req, res) => {
    const { inventoryId, newInstallerId, reason } = req.body

    // Validate request body
    if (!inventoryId || !newInstallerId || !reason) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if files are included
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Supporting documents are required' })
    }

    try {
        // Get current user by username from JWT
        const username = req.user
        const currentUser = await User.findOne({ username }).lean().exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        // Check if inventory exists
        const inventory = await Inventory.findById(inventoryId)
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' })
        }

        // Check if new installer exists and has Installer role
        const newInstaller = await User.findById(newInstallerId)
        if (!newInstaller) {
            return res.status(404).json({ message: 'New installer not found' })
        }

        // Check if user has installer role
        const hasInstallerRole = newInstaller.roles &&
            (Array.isArray(newInstaller.roles)
                ? newInstaller.roles.includes('Installer')
                : newInstaller.roles.Installer)

        if (!hasInstallerRole) {
            return res.status(400).json({
                message: 'Selected user must have Installer role'
            })
        }

        // Create document objects directly
        const documents = req.files.map(file => ({
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            data: file.buffer.toString('base64')
        }));

        // Create new transfer
        const transfer = await Transfer.create({
            inventoryId,
            previousInstallerId: inventory.user, // Current owner
            newInstallerId,
            documents,
            reason
        })

        if (transfer) {
            return res.status(201).json({
                message: 'Transfer request created successfully',
                transferId: transfer._id
            })
        } else {
            return res.status(400).json({ message: 'Invalid transfer data received' })
        }
    } catch (error) {
        console.error('Error in createTransfer:', error)
        return res.status(500).json({ message: 'Error creating transfer', error: error.message })
    }
}

// @desc Get all transfers
// @route GET /transfers
// @access Private (Admin/Manager only)
const getAllTransfers = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Add status filter if provided
    const filter = {}
    if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
        filter.status = req.query.status
    }

    try {
        const transfers = await Transfer.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.address')
            .populate('previousInstallerId', 'username')
            .populate('newInstallerId', 'username')
            .populate('approvedBy', 'username')
            .lean()

        // Count total without pagination
        const total = await Transfer.countDocuments(filter)

        // Remove base64 data from response to reduce payload size
        const sanitizedTransfers = transfers.map(transfer => {
            if (transfer.documents) {
                transfer.documents = transfer.documents.map(doc => {
                    return {
                        name: doc.name,
                        type: doc.type,
                        size: doc.size,
                        hasData: !!doc.data
                    }
                })
            }
            return transfer
        })

        res.json({
            data: sanitizedTransfers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error in getAllTransfers:', error)
        res.status(500).json({ message: 'Error retrieving transfers' })
    }
}

// @desc Get transfers for current user
// @route GET /transfers/user
// @access Private
const getUserTransfers = async (req, res) => {
    try {
        const username = req.user
        const currentUser = await User.findOne({ username }).lean().exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        const transfers = await Transfer.find({
            $or: [
                { previousInstallerId: currentUser._id },
                { newInstallerId: currentUser._id }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.address')
            .populate('previousInstallerId', 'username')
            .populate('newInstallerId', 'username')
            .lean()

        const sanitizedTransfers = transfers.map(transfer => {
            if (transfer.documents) {
                transfer.documents = transfer.documents.map(doc => {
                    return {
                        name: doc.name,
                        type: doc.type,
                        size: doc.size,
                        hasData: !!doc.data
                    }
                })
            }
            return transfer
        })

        res.json({
            data: sanitizedTransfers,
            meta: {
                total: sanitizedTransfers.length,
                page: 1,
                limit: sanitizedTransfers.length,
                totalPages: 1
            }
        })
    } catch (error) {
        console.error('Error in getUserTransfers:', error)
        res.status(500).json({ message: 'Error retrieving user transfers' })
    }
}

// @desc Get a single transfer by ID
// @route GET /transfers/:id
// @access Private
const getTransferById = async (req, res) => {
    const { id } = req.params

    try {
        const transfer = await Transfer.findById(id)
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.address')
            .populate('previousInstallerId', 'username')
            .populate('newInstallerId', 'username')
            .populate('approvedBy', 'username')
            .lean()

        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' })
        }

        const username = req.user
        const currentUser = await User.findOne({ username }).lean().exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        const isAdmin = req.roles && (Array.isArray(req.roles)
            ? req.roles.includes('Admin')
            : req.roles.Admin)
        const isManager = req.roles && (Array.isArray(req.roles)
            ? req.roles.includes('Manager')
            : req.roles.Manager)

        if (!isAdmin && !isManager) {
            const isInvolved =
                transfer.previousInstallerId?._id?.toString() === currentUser._id.toString() ||
                transfer.newInstallerId?._id?.toString() === currentUser._id.toString()

            if (!isInvolved) {
                return res.status(403).json({ message: 'Access denied' })
            }
        }

        if (transfer.documents) {
            transfer.documents = transfer.documents.map(doc => ({
                name: doc.name,
                type: doc.type,
                size: doc.size,
                hasData: !!doc.data
            }));
        }

        res.json(transfer)
    } catch (error) {
        console.error('Error in getTransferById:', error)
        res.status(500).json({ message: 'Error retrieving transfer' })
    }
}

// @desc Get transfers for specific user (Admin only)
// @route GET /transfers/user/:userId
// @access Private (Admin only)
const getUserTransfersById = async (req, res) => {
    const { userId } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const transfers = await Transfer.find({
            $or: [
                { previousInstallerId: userId },
                { newInstallerId: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('inventoryId', 'properties.ownerName properties.reCat properties.address')
            .populate('previousInstallerId', 'username')
            .populate('newInstallerId', 'username')
            .lean()

        const sanitizedTransfers = transfers.map(transfer => {
            if (transfer.documents) {
                transfer.documents = transfer.documents.map(doc => {
                    return {
                        name: doc.name,
                        type: doc.type,
                        size: doc.size,
                        hasData: !!doc.data
                    }
                })
            }
            return transfer
        })

        res.json({
            data: sanitizedTransfers,
            meta: {
                total: sanitizedTransfers.length,
                page: 1,
                limit: sanitizedTransfers.length,
                totalPages: 1
            }
        })
    } catch (error) {
        console.error('Error in getUserTransfersById:', error)
        res.status(500).json({ message: 'Error retrieving user transfers' })
    }
}

// @desc Get a single transfer document
// @route GET /transfers/:id/documents/:docId
// @access Private
const getTransferDocument = async (req, res) => {
    const { id, docId } = req.params

    try {
        const transfer = await Transfer.findById(id)
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' })
        }

        const username = req.user
        const currentUser = await User.findOne({ username }).lean().exec()
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        const isAdmin = hasRole(req.roles, 'Admin')
        const isManager = hasRole(req.roles, 'Manager')
        const isInvolved =
            transfer.previousInstallerId?.toString() === currentUser._id.toString() ||
            transfer.newInstallerId?.toString() === currentUser._id.toString()

        if (!isAdmin && !isManager && !isInvolved) {
            return res.status(403).json({ message: 'Access denied' })
        }

        const docIndex = parseInt(docId)
        if (isNaN(docIndex) || docIndex < 0 || docIndex >= transfer.documents.length) {
            return res.status(404).json({ message: 'Document not found' })
        }

        const document = transfer.documents[docIndex]

        res.json({
            name: document.name,
            type: document.type,
            size: document.size,
            data: document.data
        })
    } catch (error) {
        console.error('Error in getTransferDocument:', error)
        res.status(500).json({ message: 'Error retrieving document' })
    }
}

// @desc Approve a transfer (updates inventory owner and pushes to previousUsers)
// @route PATCH /transfers/:id/approve
// @access Private (Admin/Manager only)
const approveTransfer = async (req, res) => {
    const { id } = req.params
    const { notes } = req.body

    try {
        const username = req.user
        const adminUser = await User.findOne({ username }).lean().exec()
        if (!adminUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        const transfer = await Transfer.findById(id)
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' })
        }

        if (transfer.status !== 'pending') {
            return res.status(400).json({
                message: `Transfer is already ${transfer.status}`
            })
        }

        // Update inventory owner history
        const inventory = await Inventory.findById(transfer.inventoryId)
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' })
        }

        if (!Array.isArray(inventory.previousUsers)) inventory.previousUsers = [];
        inventory.previousUsers.push(inventory.user);
        inventory.user = transfer.newInstallerId;
        await inventory.save();

        transfer.status = 'approved'
        transfer.approvedBy = adminUser._id
        transfer.approvalDate = new Date()
        transfer.notes = notes || 'Approved'
        await transfer.save()

        res.json({
            message: 'Transfer approved successfully',
            transfer: {
                id: transfer._id,
                status: transfer.status,
                approvalDate: transfer.approvalDate
            }
        })
    } catch (error) {
        console.error('Error in approveTransfer:', error)
        res.status(500).json({ message: 'Error approving transfer' })
    }
}

// @desc Reject a transfer
// @route PATCH /transfers/:id/reject
// @access Private (Admin/Manager only)
const rejectTransfer = async (req, res) => {
    const { id } = req.params
    const { notes } = req.body

    try {
        const username = req.user
        const adminUser = await User.findOne({ username }).lean().exec()
        if (!adminUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        const transfer = await Transfer.findById(id)
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' })
        }

        if (transfer.status !== 'pending') {
            return res.status(400).json({
                message: `Transfer is already ${transfer.status}`
            })
        }

        transfer.status = 'rejected'
        transfer.approvedBy = adminUser._id
        transfer.approvalDate = new Date()
        transfer.notes = notes || 'Rejected'
        await transfer.save()

        res.json({
            message: 'Transfer rejected successfully',
            transfer: {
                id: transfer._id,
                status: transfer.status,
                approvalDate: transfer.approvalDate
            }
        })
    } catch (error) {
        console.error('Error in rejectTransfer:', error)
        res.status(500).json({ message: 'Error rejecting transfer' })
    }
}

// @desc Delete a transfer
// @route DELETE /transfers/:id
// @access Private (Admin only)
const deleteTransfer = async (req, res) => {
    const { id } = req.params

    try {
        const transfer = await Transfer.findById(id)
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' })
        }

        await Transfer.deleteOne({ _id: id })

        res.json({ message: 'Transfer deleted successfully' })
    } catch (error) {
        console.error('Error in deleteTransfer:', error)
        res.status(500).json({ message: 'Error deleting transfer' })
    }
}

// @desc Check for existing transfer requests for an inventory
// @route GET /transfers/check/:inventoryId
// @access Private
const checkExistingTransfers = async (req, res) => {
    try {
        const { inventoryId } = req.params;
        const existingTransfers = await Transfer.find({
            inventoryId,
            status: "pending"
        }).lean();

        if (existingTransfers.length > 0) {
            const enhancedTransfers = await Promise.all(existingTransfers.map(async (transfer) => {
                const newInstaller = await User.findById(transfer.newInstallerId).lean();
                return {
                    ...transfer,
                    newInstallerName: newInstaller?.username || "Unknown"
                };
            }));

            return res.json(enhancedTransfers);
        }

        return res.json([]);
    } catch (error) {
        console.error('Error checking for existing transfers:', error);
        return res.status(500).json({ message: 'Server error while checking for duplicates' });
    }
};

module.exports = {
    createTransfer,
    getAllTransfers,
    getUserTransfers,
    getUserTransfersById,
    getTransferById,
    getTransferDocument,
    approveTransfer,
    rejectTransfer,
    deleteTransfer,
    checkExistingTransfers
}