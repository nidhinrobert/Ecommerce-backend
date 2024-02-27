const mongoose = require('mongoose');
const paymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    amount: {
        type: Number,
    },
    sessionId: {
        type: String,
    },
    paymentStatus:{
        type:String,
        default:'pending',
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    }
});
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;