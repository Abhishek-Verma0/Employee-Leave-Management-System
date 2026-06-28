const User = require("../models/User");
const Leave = require("../models/Leave");
const Reimbursement = require("../models/Reimbursement");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// Safe user mapper to prevent sensitive field leakage
const toSafeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
});

//  upadte user role
const updateUserRole = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }
    const { role } = req.body; 

    

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Apply the promotion or demotion!
    user.role = role;
    await user.save();

    const safeUser = toSafeUser(user);
    res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        data: safeUser,
        user: safeUser
    });
});

//  get all user
const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({});
    const safeUsers = users.map(toSafeUser);
    
    return res.status(200).json({
        success: true,
        data: safeUsers,
        user: safeUsers
    });
});

//  delete User
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }
    const deleteduser = await User.findByIdAndDelete(userId);
    if (!deleteduser) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Cascade delete associated leaves and reimbursements
    await Leave.deleteMany({ user: userId });
    await Reimbursement.deleteMany({ user: userId });

    return res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

module.exports = { updateUserRole, getAllUser, deleteUser };
