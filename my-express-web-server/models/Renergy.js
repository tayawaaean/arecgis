const mongoose = require('mongoose');

const renergySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type:{
        type: String,
        default: 'Point'
    },
    coordinates:{
        type: Array,   
        required: true,
    },
    images:{
        type: Array
    },
    assessment:{
        type: mongoose.Schema.Types.Mixed
    },
    properties: {
        ownerName: {
            type: String,
            required: true,
        },
        retype: [{
            type: String,
            default: 'Solar Energy System'
        }],
        reCat: {
            type: String // Add if not already present
        },
        reClass: {
            type: String // Add if not already present
        },
        yearEst: {
            type: String // Add if not already present
        },
        acquisition: {
            type: String // Add if not already present
        },
        isNetMetered: {
            type: String, // or Boolean if you want true/false
            default: 'No'
        },
        ownUse: {
            type: String, // or Boolean if you want true/false
            default: 'No'
        },
        address: {
            country:{
                type: String,
                required: true,
            },
            region:{
                type: String,
                required: true,
            },
            province:{
                type: String,
                required: true,
            },
            city:{
                type: String,
                required: true,
            },
            brgy:{
                type: String,
                required: true,
            },
        }
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Renergy', renergySchema)