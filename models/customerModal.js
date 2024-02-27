const mongoose = require ('mongoose');

const customerSchema = new mongoose.Schema({
    
    name: {
        type: String,
        require: true
    },
    
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    }
})

const customerDb = mongoose.model('customer',customerSchema);
module.exports = customerDb