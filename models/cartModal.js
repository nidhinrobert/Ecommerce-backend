const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
},
);
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;