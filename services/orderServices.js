const Order = require("../models/orderModal");
const asyncHandler = require("express-async-handler");


const getAllOrdersService = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.aggregate([{ $match: { orderStatus: "complete" } }]);

        return orders;
    } catch (error) {
        console.error('Error (getAllOrders):', error);
        throw error;
    }
});

const getOrderByIdService = asyncHandler(async (id) => {
    try {
        const orderById = await Order.findOne({ _id: id });
        
        return orderById;
    } catch (error) {
        console.error('Error (getOrderById):', error);
        throw error;
    }
})


const getUserOrderService = asyncHandler(async (userId) => {
    try {
        const order = await Order.find({ userId });

        return order;
    } catch (error) {
        console.error('Error (getUserOrder):', error);
        throw error;
    }
})


module.exports = {
    getAllOrdersService,
    getOrderByIdService,
    getUserOrderService,
}