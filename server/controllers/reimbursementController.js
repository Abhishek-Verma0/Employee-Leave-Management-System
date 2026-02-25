const Reimbursement = require("../models/Reimbursement");
const imagekit = require("../config/imagekit");
const { toFile } = require("@imagekit/nodejs");

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
const applyReimbursement = async (req, res) => {
  try {
    const { amount, expenseDate, description } = req.body;

    let billUrl = null;
    let billFileId = null;

    //  upload bill if file is attached
    if (req.file) {
      const uploaded = await uploadToImageKit(req.file.buffer, req.file.originalname);
      billUrl = uploaded.url;
      billFileId = uploaded.fileId;
    }

    //  creating reimbursement
    const reimbursement = await Reimbursement.create({
      user: req.user.id,
      amount,
      expenseDate,
      description,
      billUrl,
      billFileId,
    });
    return res.status(201).json({
      message: "Reimbursement applied successfully",
      reimbursement,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//  getting all reimbursement from db for a particular user

const getReimbursement = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({ user: req.user.id }).sort(
      { createdAt: -1 },
    );
    return res.status(200).json(reimbursements);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//  updating reimbursement status

const updateReimbursement = async (req, res) => {
  try {
    const reimbursementId = req.params.id;
    const { status } = req.body;

    const reimbursement =
      await Reimbursement.findById(reimbursementId).populate("user");
    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement not found" });
    }
    const applicantRole = reimbursement.user.role;
    const approverRole = req.user.role;

    if (approverRole === "manager" && applicantRole !== "employee") {
      return res
        .status(403)
        .json({ message: "Manger can approve only employee reimbursement" });
    }
    if (approverRole === "admin" && applicantRole !== "manager") {
      return res
        .status(403)
        .json({ message: "Admin can approve only manager reimbursement" });
    }
    reimbursement.status = status;
    await reimbursement.save();

    return res.status(200).json({ message: `Reimbursement ${status} successfully`, reimbursement });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  get all reimbursement for admin or manager

const getAllReimbursement = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({ user: { $ne: req.user.id } }).populate("user", "email").sort({ createdAt: -1 });
    return res.status(200).json({ reimbursements });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  update bill on an existing reimbursement

const updateBill = async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement not found" });
    }

    //  only the owner can update their bill
    if (reimbursement.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorised" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
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

    return res.status(200).json({ message: "Bill updated successfully", reimbursement });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  delete bill from a reimbursement

const deleteBill = async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement not found" });
    }

    //  only the owner can delete their bill
    if (reimbursement.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorised" });
    }

    if (reimbursement.billFileId) {
      await deleteFromImageKit(reimbursement.billFileId);
    }

    reimbursement.billUrl = null;
    reimbursement.billFileId = null;
    await reimbursement.save();

    return res.status(200).json({ message: "Bill deleted successfully", reimbursement });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { applyReimbursement, getReimbursement, updateReimbursement, getAllReimbursement, updateBill, deleteBill };
