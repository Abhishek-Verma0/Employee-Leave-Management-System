const Reimbursement = require("../models/Reimbursement");
const imagekit = require("../config/imagekit");
const { toFile } = require("@imagekit/nodejs");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

//  helper: upload buffer to ImageKit
const uploadToImageKit = async (fileBuffer, originalName) => {
  const file = await toFile(fileBuffer, originalName);
  const result = await imagekit.files.upload({
    file,
    fileName: originalName,
    folder: "/reimbursement-bills",
  });
  return { url: result.url, fileId: result.fileId };
};

//  helper: delete file from ImageKit
const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.files.delete(fileId);
  } catch (err) {
    console.log("ImageKit delete error (non-fatal):", err.message);
  }
};

//  apply for reimbursement
const applyReimbursement = asyncHandler(async (req, res) => {
  const { amount, expenseDate, description } = req.body;

  const numericAmount =
    typeof amount === "string"
      ? Number(amount.trim())
      : Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be a positive number",
    });
  }

  let billUrl = null;
  let billFileId = null;

  if (req.file) {
    const uploaded = await uploadToImageKit(req.file.buffer, req.file.originalname);
    billUrl = uploaded.url;
    billFileId = uploaded.fileId;
  }

  const reimbursement = await Reimbursement.create({
    user: req.user.id,
    amount: numericAmount,
    expenseDate,
    description,
    billUrl,
    billFileId
  });

  return res.status(201).json({
    success: true,
    message: "Reimbursement applied successfully",
    data: reimbursement,
    reimbursement
  });
});

// get reimbursement
const getReimbursement = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalItems = await Reimbursement.countDocuments({ user: req.user.id });

  const reimbursements = await Reimbursement.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({
    success: true,
    data: reimbursements,
    currentPage: page,
    totalPages,
    totalItems
  });
});

//  updating reimbursement status
const updateReimbursement = asyncHandler(async (req, res) => {
  const reimbursementId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reimbursementId)) {
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

  const reimbursement =
    await Reimbursement.findById(reimbursementId).populate("user");
  if (!reimbursement) {
    return res.status(404).json({
      success: false,
      message: "Reimbursement not found"
    });
  }

  if (reimbursement.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Reimbursement status has already been finalized"
    });
  }

  if (!reimbursement.user) {
    return res.status(400).json({
      success: false,
      message: "Applicant user no longer exists"
    });
  }

  if (reimbursement.user._id.toString() === req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You cannot approve or reject your own reimbursement"
    });
  }

  const applicantRole = reimbursement.user.role;
  const approverRole = req.user.role;

  if (approverRole === "manager" && applicantRole !== "employee") {
    return res.status(403).json({
      success: false,
      message: "Managers can only approve or reject reimbursements for employees"
    });
  }

  reimbursement.status = status;
  await reimbursement.save();

  return res.status(200).json({
    success: true,
    message: "Reimbursement status updated successfully",
    data: reimbursement
  });
});

// get all reimbursement
const getAllReimbursement = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { user: { $ne: req.user.id } };

  const totalItems = await Reimbursement.countDocuments(query);

  const reimbursements = await Reimbursement.find(query)
    .populate("user", "email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({
    success: true,
    data: reimbursements,
    currentPage: page,
    totalPages,
    totalItems
  });
});

//  update bill on an existing reimbursement
const updateBill = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }
  const reimbursement = await Reimbursement.findById(req.params.id);
  if (!reimbursement) {
    return res.status(404).json({
      success: false,
      message: "Reimbursement not found"
    });
  }

  //  only the owner can update their bill
  if (reimbursement.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorised"
    });
  }

  // Prevent modifying the bill of a reimbursement request that has already been approved or rejected (Integrity Check)
  if (reimbursement.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Cannot modify bill for a processed reimbursement"
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file provided"
    });
  }

  //  delete old file from ImageKit if exists
  if (reimbursement.billFileId) {
    await deleteFromImageKit(reimbursement.billFileId);
  }

  //  upload new file
  const uploaded = await uploadToImageKit(req.file.buffer, req.file.originalname);
  reimbursement.billUrl = uploaded.url;
  reimbursement.billFileId = uploaded.fileId;
  await reimbursement.save();

  return res.status(200).json({
    success: true,
    message: "Bill updated successfully",
    data: reimbursement,
    reimbursement
  });
});

//  delete bill from a reimbursement
const deleteBill = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }
  const reimbursement = await Reimbursement.findById(req.params.id);
  if (!reimbursement) {
    return res.status(404).json({
      success: false,
      message: "Reimbursement not found"
    });
  }

  //  only the owner can delete their bill
  if (reimbursement.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorised"
    });
  }

  // Prevent deleting the bill of a reimbursement request that has already been approved or rejected (Integrity Check)
  if (reimbursement.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Cannot delete bill for a processed reimbursement"
    });
  }

  if (reimbursement.billFileId) {
    await deleteFromImageKit(reimbursement.billFileId);
  }

  reimbursement.billUrl = null;
  reimbursement.billFileId = null;
  await reimbursement.save();

  return res.status(200).json({
    success: true,
    message: "Bill deleted successfully",
    data: reimbursement,
    reimbursement
  });
});

module.exports = {
  applyReimbursement,
  getReimbursement,
  updateReimbursement,
  getAllReimbursement,
  updateBill,
  deleteBill
};
