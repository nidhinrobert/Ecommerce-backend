const Category = require("../models/categoryModel");
const multer = require('multer');
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

const upload = multer({ storage: storage }).single('categoryImg');

//getting all categories
const getCategories = async (req, res) => {
    const category = await Category.find();
    res.status(200).json(category);
}

//creating category
const createCategory = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error handling file upload." });
            }

            const { categoryName, description } = req.body;

            if (!categoryName || !description) {
                return res.status(400).json({ error: "All fields are mandatory!" });
            }
            const categoryImg = req.file ? req.file.filename : null;

            const category = await Category.create({
                categoryName,
                description,
                categoryImg,
            });

            res.status(201).json(category);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

//retrieve single category
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//Updating categories
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error handling file upload." });
            }

            const { categoryName, description } = req.body;

            const updatedFields = { categoryName, description };

            if (req.file) {
                updatedFields.categoryImg = req.file.filename; 
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                req.params.id,
                updatedFields,
                { new: true }
            );

            res.status(200).json(updatedCategory);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



//deleting a category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        await Category.deleteOne({ _id: req.params.id });

        if (category.categoryImg) {
            const imagePath = path.join(__dirname, '..', 'images', category.categoryImg);
            fs.unlinkSync(imagePath);
        }



        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { createCategory, getCategory, getCategories, updateCategory, deleteCategory };
