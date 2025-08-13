const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        default: ['Employee'],
    },
    active: {
        type: Boolean,
        default: true
    },
    fullName: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    contactNumber: {
        type: String,
        default: ''
    },
    affiliation: {
        type: String,
        default: ''
    },
    companyName: {
        type: String,
        default: ''
    },
    companyContactNumber: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('User', userSchema)