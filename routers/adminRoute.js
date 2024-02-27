 const express = require("express");
const router = express.Router();
const { login } = require("../controllers/adminController");



router.route("/login").post(login);



module.exports = router;

