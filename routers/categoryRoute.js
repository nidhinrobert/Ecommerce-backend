const express = require ("express");
const router = express.Router();
const { createCategory,getCategory, getCategories,updateCategory,deleteCategory} = require("../controllers/categoryController")
 

router.route("/").get(getCategories);
router.route("/").post(createCategory);
router.route("/:id").get(getCategory)
router.route("/:id").put(updateCategory)
router.route("/:id").delete(deleteCategory)





module.exports = router;