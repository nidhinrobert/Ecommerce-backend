const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModal');
const orderService = require('../services/orderServices');



// get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrdersService();
    if (!orders) {
        
        res.status(404).json({ message: "orders not found"});
    }

    res.status(200).json({ orders });
})


// getOrderById
const getOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const orderById = await orderService.getOrderByIdService(id)
        if (!orderById) {

            res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ orderById });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "Internal server error" });
    }
});

// get user order
const getUserOrder = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    
    const order = await orderService.getUserOrderService(userId);
    if (!order) {

        res.status(404).json({ message: "order not found" });
    }

    res.status(200).json({ order });
});


module.exports = {
    getOrderById,
    getAllOrders,
    getUserOrder,
};