const express = require("express");
const router = express.Router();
const {signup,signin,getUser}=require ("../controllers/userController")




router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/").get(getUser)



module.exports = router;