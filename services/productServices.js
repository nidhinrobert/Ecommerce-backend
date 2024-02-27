const Product = require("../models/productModel");
const path = require('path');
const fs = require('fs');

const getProducts = async () => {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw error;
    }
};

const createProduct = async (name, categoryId, price, discount, specifications, description, images) => {
    try {
        const product = await Product.create({
            name,
            categoryId,
            price,
            discount,
            specifications,
            description,
            images,
        });
        return product;
    } catch (error) {
        throw error;
    }
};

const getProduct = async (productId) => {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (productId, newData) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        // Update product fields
        Object.assign(product, newData);

        const updatedProduct = await product.save();
        return updatedProduct;
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        await Product.deleteOne({ _id: productId });

        if (product.images && product.images.length > 0) {
            product.images.forEach(image => {
                const imagePath = path.join(__dirname, '..', 'images', image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        return product;
    } catch (error) {
        throw error;
    }
};

const getProductByCategory = async (categoryId) => {
    try {
        const productItems = await Product.aggregate([
            {
                $match: {
                    categoryId: String(categoryId)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true
                },
            }
        ]);
        return productItems;
    } catch (error) {
        throw error;
    }
};

module.exports = { getProducts, createProduct, getProduct, getProductByCategory, updateProduct, deleteProduct };
