const mongoose = require('mongoose')

// Create a schema for document objects first
const documentSchema = new mongoose.Schema({
    name: String,
    type: String, // mimetype
    data: String, // base64 encoded file data
    size: Number
}, { _id: false }); // Prevent Mongoose from creating _id for each document

const transferSchema = new mongoose.Schema({
    inventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    previousInstallerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    newInstallerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Use an array of document schema objects instead of direct definition
    documents: [documentSchema],
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
    },
    notes: {
        type: String // Admin notes about approval/rejection
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Transfer', transferSchema)