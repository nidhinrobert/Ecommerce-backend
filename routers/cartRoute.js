const express = require ("express");
const router  = express.Router();
const {addToCart, getUserBuyingCarts, removeFromCart, updateQuantity} = require("../controllers/cartController")



router.route('/:id').get(getUserBuyingCarts);
router.route('/').post( addToCart);
router.route('/:userId/:productId').delete(removeFromCart);
router.route("/:userId/:productId").put(updateQuantity);
router.route('/create-checkout-session').post( );


module.exports = router