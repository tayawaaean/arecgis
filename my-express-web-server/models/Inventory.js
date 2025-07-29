const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const inventorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: Array,
        required: true,
    },
    images:
        [{
            type: String,
        }],
    // images:{
    //     type: Array
    // },
    assessment: {
        type: mongoose.Schema.Types.Mixed
    },
    properties: {
        ownerName: {
            type: String,
            required: true,
        },
        reCat: {
            type: String,
            default: 'Solar Energy System'
        },
        reClass: {
            type: String,
            required: true,
        },
        yearEst: {
            type: String,
            required: true,
        },
        acquisition: {
            type: String,
            required: true,
        },
        address: {
            country: {
                type: String,
                required: true,
            },
            region: {
                type: String,
                required: true,
            },
            province: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            brgy: {
                type: String,
                required: true,
            },
        },
    },

},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Inventory', inventorySchema)