const express = require ("express");
const router  = express.Router();
const {create_checkout_session,ritrieveCheckoutSession}=require("../controllers/paymentController")


router.route('/create_checkout_session').post(create_checkout_session);
router.route('/retrive-checkout-session/:id/:userId').get(ritrieveCheckoutSession);










module.exports= router