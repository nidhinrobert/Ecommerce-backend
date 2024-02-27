const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModal');

// Get user's buying carts
const getUserBuyingCarts = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = new mongoose.Types.ObjectId(id);
        
        const userCartsAggregate = await Cart.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $group: {
                    _id: "$_id",
                    totalQuantity: { $sum: "$items.quantity" },
                    items: {
                        $push: {
                            _id: "$items._id",
                            quantity: "$items.quantity",
                            productDetails: { $arrayElemAt: ["$productDetails", 0] }
                        }
                    }
                }
            }
        ]);
        if (userCartsAggregate.length === 0) {
            return res.status(200).json({ userCarts: [], totalQuantity: 0 });
        }
        const { totalQuantity } = userCartsAggregate[0];
        
        res.status(200).json({ userCarts: userCartsAggregate, totalQuantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// create new cart
const addToCart = asyncHandler(async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({ userId, items: [{ product: productId, quantity }] });
            return res.status(201).json(cart);
        }
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, 'items.product': productId },
            { $inc: { 'items.$.quantity': quantity } },
            { new: true }
        );
        if (!updatedCart) {
            await Cart.findOneAndUpdate(
                { userId },
                { $push: { items: { product: productId, quantity } } }
            );
        }
        const createCart = await Cart.findOne({ userId });

        res.status(200).json(createCart);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// update quantity
const updateQuantity = asyncHandler(async (req, res) => {
    const { userId, productId } = req.params;
    const { action } = req.body;
    try {
        let updateQuery = {};

        if (action === 'increment') {
            updateQuery = { $inc: { 'items.$.quantity': 1 } };
        } else if (action === 'decrement') {
            updateQuery = { $inc: { 'items.$.quantity': -1 } };
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, 'items.product': productId },
            updateQuery,
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Remove a product from the cart
const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const cartItem = await Cart.findOneAndUpdate(
            { userId, 'items.product': productId },
            { $pull: { items: { product: productId } } },
            { new: true }
        );

        if (!cartItem) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        res.status(200).json({ cartItem });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getUserBuyingCarts,
    updateQuantity
};
