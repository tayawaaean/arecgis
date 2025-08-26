const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
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

// Add instance method to check profile completion
userSchema.methods.isProfileComplete = function() {
    return !!(this.fullName && this.email && this.address && this.contactNumber);
};

// Add virtual for profile completion percentage
userSchema.virtual('profileCompletionPercentage').get(function() {
    const requiredFields = ['fullName', 'email', 'address', 'contactNumber'];
    const completedFields = requiredFields.filter(field => this[field] && this[field].trim() !== '');
    return Math.round((completedFields.length / requiredFields.length) * 100);
});

module.exports = mongoose.model('User', userSchema)