const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        requore: true
    },
    categoryId: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    discount: {
        type: String
    },
    specifications: {
        type: String,
    },
    description: {
        type: String,
    },
    images: {
        type: []
    },
})

const productDb = mongoose.model('product', productSchema);
module.exports = productDb