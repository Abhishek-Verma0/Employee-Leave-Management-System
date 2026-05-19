const express = require("express");

const router = express.Router();

const {
  loginUser,
  registerUser,
} = require("../controllers/authController");

const validate =
  require("../middleware/validate");

const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");

const {
  authLimiter,
} = require("../middleware/rateLimiter");

const User =
  require("../models/User");

// Register Route
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  registerUser
);

// Login Route
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  loginUser
);

// Google Login Route
router.post(
  "/google-login",
  async (req, res) => {

    try {

      const { name, email } =
        req.body;

      let user =
        await User.findOne({ email });

      if (!user) {

        user = await User.create({
          name,
          email,
          password: "google-auth",
          role: "employee",
        });

      }

      res.status(200).json({
        success: true,
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }
);

module.exports = router;