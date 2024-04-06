const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModal');
const orderService = require('../services/orderServices');

const { ObjectId } = require('mongoose').Types;


// get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const search = req.query.search ||'';
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1;
    const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage) : 10;
    
    
    try {
        const matchStage = {
            orderStatus: "complete" 
        };
        if (search) {
            matchStage.$or = [
                { _id: ObjectId.isValid(search) ? new ObjectId(search) : null },
                { customerEmail: { $regex: search, $options: 'i' } },
            ].filter(Boolean);
        }
        
        const aggregationPipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    Orders: [
                        { $project: { _id: 1, customerEmail: 1 ,totalAmount:1,orderDate:1,orderStatus:1} },
                        { $skip: Math.max(0, (currentPage - 1) * itemsPerPage) }, 
                        { $limit: itemsPerPage },
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ],
                }
            },
            {
                $project: {
                    Orders: 1,
                    totalCount: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
                }
            }
        ];
       
      
        const result = await Order.aggregate(aggregationPipeline); 
        const { Orders, totalCount } = result[0];
        res.status(200).json({ Orders, totalCount });
    } catch (error) {
        console.error('Error (getAllOrders):', error);
        res.status(500).json({ error: "Internal server error" });
    }
});


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