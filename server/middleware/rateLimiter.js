const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes rate limit time

    max: 5,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many authentication attempts. Please try again later.",
    },
});

module.exports = { authLimiter }