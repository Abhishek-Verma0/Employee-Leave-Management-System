const { ZodError } = require("zod");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    // Validation errors using Zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((error) => ({
                field: error.path.join("."),
                message: error.message
            })),
        });
    }

    // Invalid Objectid from mongoose
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }

    // JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        })
    }

    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: "Token expired"
        })
    }

    // Duplicate key of MongoDb error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Resource already exists",
        });
    }

    // Server error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
    });
};

module.exports = errorMiddleware