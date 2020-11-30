const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Store images as urls to wherever the image is hosted
    images: [{
        type: String,
        get: v => `${v}`
    }]
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;