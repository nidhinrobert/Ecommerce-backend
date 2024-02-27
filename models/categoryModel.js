const mongoose = require ('mongoose');

const categorySchema = new mongoose.Schema({
    categoryImg: {
        type : String,
        require : true,
    },
    categoryName: {
        type : String,
        require : true,
        unique: true
    },
    description: {
        type: String
    }
})

const categoryDb = mongoose.model('category',categorySchema);
module.exports = categoryDb