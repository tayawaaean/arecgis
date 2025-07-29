const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose)

const blogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    blogTitle:{
        type: String,
        required: true,
    },
    blogSummary:{
        type: String,   
        required: true,
    },
    blogContent:{
        type: String,
        required: true,
    },
    images:{
        type: Array
    },
   
    
},
    {
        timestamps: false,
    }
)


module.exports = mongoose.model('Blog', blogSchema)