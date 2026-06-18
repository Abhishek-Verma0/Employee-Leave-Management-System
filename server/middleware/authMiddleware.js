const jwt = require("jsonwebtoken")
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        //  get token from req header
        const header = req.headers.authorization
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token, auth denied"
            });
        }
        //  extracting token 
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch fresh user from DB to ensure they still exist and have the current role
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User no longer exists, authorization denied" });
        }

        // Attach fresh user details to req
        req.user = {
            id: user._id,
            role: user.role,
        };
        next()
    }
    catch (err) {
        next(err);
    }
}

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You do not have permission"
            });
        }
        next();
    };
};

module.exports = { authMiddleware, checkRole };