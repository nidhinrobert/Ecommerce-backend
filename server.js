const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/connection")
const path = require("path")
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use (cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/cart',require("./routers/cartRoute"));
app.use("/api/product",require("./routers/productRoute"));
app.use("/api/category",require("./routers/categoryRoute"));
app.use("/admin",require("./routers/adminRoute"))
app.use("/user",require("./routers/userRoute"))
app.use("/api/order",require("./routers/orderRoute"))
app.use("/images", express.static(path.resolve(__dirname,"images"))) 
app.use("/api/stripe",require("./routers/paymentRouter"))
const port = process.env.PORT || 5000;

app.listen(port,() => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});