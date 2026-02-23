const express = require("express")
const router = express.Router()

const { loginUser, registeruser, registerUser } = require("../controllers/authController")



//  register route
router.post("/register", registerUser)

//  login user

router.post("/login", loginUser)

module.exports=router