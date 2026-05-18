const express = require("express")
const router = express.Router()

const { loginUser, registerUser } = require("../controllers/authController")

const validate = require("../middleware/validate")

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator")

const User = require("../models/User")
// Register Route
router.post(
  "/register",
  validate(registerSchema),
  registerUser
)

// Login Route
router.post(
  "/login",
  validate(loginSchema),
  loginUser
)

// Google Login Route
router.post("/google-login", async (req, res) => {
  try {

    const { name, email } = req.body

    let user = await User.findOne({ email })

    if (!user) {

      user = await User.create({
        name,
        email,
        password: "google-auth",
        role: "employee",
      })

    }

    res.json({
      success: true,
      user,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Server Error",
    })

  }
})

module.exports = router