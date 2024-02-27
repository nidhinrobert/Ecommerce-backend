const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products: [{
        product:[],
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    totalAmount: {
        type: Number,
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'complete'],
        default: "pending",
    },
    billingAddress: {
        type: {},
    },
    shippingAddress: {
        type: {},
    },
    customerEmail: {
        type:String,
      },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;