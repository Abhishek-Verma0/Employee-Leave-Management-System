const { ZodError, success } = require("zod");
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
            message: "Invalid resource ID",
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



// multer file size error
if (err.code === "LIMIT_FILE_SIZE") {
  return res.status(400).json({
    success: false,
    message: "File size exceeds 2MB limit",
  });
}

// invalid file type
if (err.message.includes("Only PNG")) {
  return res.status(400).json({
    success: false,
    message: err.message,
  });
}

module.exports = errorMiddleware