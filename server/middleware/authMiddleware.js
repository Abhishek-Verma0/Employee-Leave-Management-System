const jwt = require("jsonwebtoken");
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

        const user = await User.findById(decoded.id || decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        //  attaching to req
        req.user = {
            id: user._id,
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email
        };
        next();
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