const express = require('express');
const { getOrderById, getAllOrders, getUserOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/:id').get(getOrderById);
router.route('/').get(getAllOrders);
router.route('/details/:id').get(getUserOrder);

module.exports= router;