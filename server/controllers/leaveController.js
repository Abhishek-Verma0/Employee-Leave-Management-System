const Leave = require("../models/Leave");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

//  apply for leave
const applyLeave = asyncHandler(async (req, res) => {
    const { fromDate, toDate, reason } = req.body;

    //  validating dates
    if (!fromDate || !toDate) {
        return res.status(400).json({
            success: false,
            message: "fromDate and toDate are required"
        });
    }

    if (new Date(toDate) < new Date(fromDate)) {
        return res.status(400).json({
            success: false,
            message: "toDate cannot be before fromDate"
        });
    }

    //  creating leave
    const leave = await Leave.create({
        user: req.user.id,
        fromDate,
        toDate,
        reason
    });

    return res.status(201).json({
        success: true,
        message: "Leave applied successfully",
        data: leave,
        leave
    });
});

//  getting all leaves from db for the particular user
const getLeaves = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Leave.countDocuments({ user: req.user.id });

    const leaves = await Leave.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
        success: true,
        data: leaves,
        currentPage: page,
        totalPages,
        totalItems
    });
});

//  getting all user leave for manager role or admin
const getAllLeaves = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: { $ne: req.user.id } };
    const totalItems = await Leave.countDocuments(query);

    const leaves = await Leave.find(query)
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
        success: true,
        data: leaves,
        currentPage: page,
        totalPages,
        totalItems
    });
});

//  updating leave status
const updateLeave = asyncHandler(async (req, res) => {
    const leaveId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }

    const { status } = req.body;

    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value"
        });
    }

    const leave = await Leave.findById(leaveId).populate("user");

    if (!leave) {
        return res.status(404).json({
            success: false,
            message: "Leave not found"
        });
    }

    const applicantRole = leave.user.role;
    const approverRole = req.user.role;

    leave.status = status;
    await leave.save();

    return res.status(200).json({
        success: true,
        message: `Leave status updated to ${status}`,
        data: leave
    });
});

const getLeaveBalance = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Approved leaves
    const approvedLeaves = await Leave.find({
        user: req.user.id,
        status: "approved"
    });

    let usedDays = 0;
    for (const leave of approvedLeaves) {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);
        const diffDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        usedDays += diffDays;
    }

    // Pending leaves
    const pendingLeaves = await Leave.find({
        user: req.user.id,
        status: "pending"
    });

    let pendingDays = 0;
    for (const leave of pendingLeaves) {
        const from = new Date(leave.fromDate);
        const to = new Date(leave.toDate);
        const diffDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        pendingDays += diffDays;
    }

    const remaining = Math.max(0, user.totalLeaveDays - usedDays);

    return res.status(200).json({
        success: true,
        data: {
            totalLeaveDays: user.totalLeaveDays,
            usedLeaveDays: usedDays,
            pendingLeaveDays: pendingDays,
            remainingLeaveDays: remaining
        }
    });
});

module.exports = {
    applyLeave,
    getLeaves,
    getAllLeaves,
    updateLeave,
    getLeaveBalance

};
