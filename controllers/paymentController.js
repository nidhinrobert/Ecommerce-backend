const Stripe = require('stripe');
const asynchandler = require('express-async-handler')
const dotenv = require('dotenv');
const stripe = Stripe(process.env.STRIPE_KEY);
const Payment = require('../models/paymentModal')
const Order = require('../models/orderModal');
const Cart = require("../models/cartModal")


const create_checkout_session = async (req, res) => {
    const { cartItems, userId, totalAmount } = req.body;

    const order = await Order.create({
        userId:userId,
        products:cartItems[0].items.map(item=>({
            product: item.productDetails,
            quantity: item.quantity,
        })),
        totalAmount:totalAmount,
    })

  const line_items = cartItems[0].items.map(item => ({
    
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.productDetails.name,
                description: item.productDetails.description,
            },
            unit_amount:  Math.round((item.productDetails.price - (item.productDetails.price * item.productDetails.discount / 100)) * 100),
        },
        quantity: item.quantity,
    }));
    

          try { const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "KE"],
            },
            billing_address_collection: "required",
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 0,
                            currency: "usd",
                        },
                        display_name: "Free shipping",
                        delivery_estimate: {
                            minimum: { unit: "business_day", value: 5 },
                            maximum: { unit: "business_day", value: 7 },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 1500,
                            currency: "usd",
                        },
                        display_name: "Next day air",
                        delivery_estimate: {
                            minimum: { unit: "business_day", value: 1 },
                            maximum: { unit: "business_day", value: 1 },
                        },
                    },
                },
            ],
            phone_number_collection: { enabled: true },
            line_items,
            mode: "payment",
            success_url: `http://localhost:5173/successfull/?id=${order._id}&cartItems=${JSON.stringify(cartItems)}`,
            cancel_url: 'http://localhost:5173/cancelled',
        });
        
        

        //create payment details
        const paymentDetails =new Payment({
            userId:userId,
            orderId:order._id,
            amount:totalAmount,
            sessionId: session.id,
            paymentStatus:'pending',
        });

        await paymentDetails.save();

        res.json({url: session.url})

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
};

const ritrieveCheckoutSession = asynchandler(async(req,res)=>{
try{
    const orderId = req.params.id;
    console.log(orderId);
    const payment = await Payment.findOne({orderId});
    const session = await stripe.checkout.sessions.retrieve(payment.sessionId);
    console.log(session);
    await Payment.findByIdAndUpdate(payment._id,{paymentStatus:session.payment_status});

    await Order.findByIdAndUpdate(orderId, { 
        
        orderStatus: session.status, 
        shippingAddress: session.shipping_details.address, 
        billingAddress:session.shipping_details.address,
        customerEmail: session.customer_details.email
    });

   

   
        
        res.send({ session }); 

}catch(error){
    res.status(500).json({error:error.message})
}
});

module.exports = { create_checkout_session,ritrieveCheckoutSession };
