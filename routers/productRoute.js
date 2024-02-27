const express = require ("express");
const router = express.Router();
const {createProduct, getProducts, getProduct, getProductByCategory, updateProduct, deleteProduct}= require("../controllers/productController")


router.route("/").post(createProduct);

router.route("/:id").get(getProduct);

router.route("/").get(getProductByCategory);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProduct);




module.exports= router