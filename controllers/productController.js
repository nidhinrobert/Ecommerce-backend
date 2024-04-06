const Product = require("../models/productModel");
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');


// MULTER HANDLING
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).array('images', 5);





//creating Product
const createProduct = async (req, res) => {
    try {
        await upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error handling file upload." });
            }

            const { name, categoryId, price, discount, specifications, description } = req.body;

            const requiredFields = ["name", "categoryId", "price"];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).send({ message: `Error: Missing ${field} field` });
                }
            }


            const images = req.files.map(file => file.filename);

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

                res.status(201).json(product);
            } catch (error) {
                console.error(error);

                res.status(500).json({ error: "Error creating product." });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error handling file upload." });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products from database' });
    }
};




//retrieve single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error handling file upload." });
            }

            const { name, categoryId, price, discount, specifications, description } = req.body;

            
            product.name = name || product.name;
            product.categoryId = categoryId || product.categoryId;
            product.price = price || product.price;
            product.discount = discount || product.discount;
            product.specifications = specifications || product.specifications;
            product.description = description || product.description;

         
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => file.filename);
                product.images = newImages;
            }

            const updatedProduct = await product.save();

            res.status(200).json(updatedProduct);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//deleting a Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        await Product.deleteOne({ _id: req.params.id });

        if (product.images && product.images.length > 0) {

            product.images.forEach(image => {
                const imagePath = path.join(__dirname, '..', 'images', image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};








const getProductByCategory = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const search = req.query.search || '';
        
       
        const matchStage = {};

        if (search) {
            matchStage.$or = [
              { name: { $regex: search, $options: 'i' } },
            ];
        }

        const aggregationPipeline = [
            {
                $match: {
                    categoryId: String(categoryId),
                    ...matchStage 
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
        ];

        const productItems = await Product.aggregate(aggregationPipeline);
        res.status(200).json({ productItems });
    } catch (error) {
        console.error('Error (getProducts):', error);
        res.status(500).json({ error: error.message });
    }
};













module.exports = { getProducts, createProduct, getProduct, getProductByCategory, updateProduct, deleteProduct }