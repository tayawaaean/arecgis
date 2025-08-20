const mongoose = require('mongoose')

// Create a schema for document objects first
const documentSchema = new mongoose.Schema({
    name: String,
    type: String, // mimetype
    data: String, // base64 encoded file data
    size: Number
}, { _id: false }); // Prevent Mongoose from creating _id for each document

const requestSchema = new mongoose.Schema({
    // Request type: 'transfer', 'bulk_transfer', or 'account_deletion'
    requestType: {
        type: String,
        enum: ['transfer', 'bulk_transfer', 'account_deletion'],
        required: true
    },
    
    // User making the request
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // For transfer requests only (single inventory)
    inventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: function() { return this.requestType === 'transfer'; }
    },
    
    // For bulk transfer requests (multiple inventories)
    inventoryIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Inventory',
        required: function() { return this.requestType === 'bulk_transfer'; }
    },
    
    // For transfer requests - the new owner (requesting user becomes the new owner)
    // This field is now optional since the requester is the new owner
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    
    // Supporting documents
    documents: [documentSchema],
    
    // Reason for the request
    reason: {
        type: String,
        required: true
    },
    
    // Request status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    // Admin who approved/rejected
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    // Review date
    reviewDate: {
        type: Date
    },
    
    // Admin notes about approval/rejection
    notes: {
        type: String
    },
    
    // Rejection reason (for rejected requests)
    rejectionReason: {
        type: String,
        enum: [
            'Insufficient documentation',
            'Invalid reason provided',
            'Request not justified',
            'Some inventories already have pending transfers',
            'One or more inventories not found'
        ]
    },

    // Store the username directly for easier access (if this exists in your DB)
    username: {
        type: String
    }
}, {
    timestamps: true
})

// Index for better query performance
requestSchema.index({ requestType: 1, status: 1 });
requestSchema.index({ requesterId: 1 });

module.exports = mongoose.model('Request', requestSchema)

