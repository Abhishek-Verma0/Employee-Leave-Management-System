const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { success } = require("zod");

//  registering user

const registerUser = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase() : "";

        //  user exist or not
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "user already exist"
            });
        }

        //  hashing pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //  create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // gen JWT token
        const token = await jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
        );

        //  response send
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

//  log in

const loginUser = async (req, res, next) => {
    try {
        const { password } = req.body;
        const email = req.body.email ? req.body.email.toLowerCase() : "";
        //  if user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!["admin", "employee", "manager"].includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Verification Pending"
            });
        }
        //  check for pass
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        //  generate jwt
        const token = await jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
        );

        //  send respone

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { registerUser, loginUser };
