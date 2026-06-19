const express = require("express");
const router = express.Router();

const upload = require("../config/multer"); // ✅ centralized multer
const fileValidation = require("../middleware/fileValidation"); // ✅ new middleware

const {
  applyReimbursement,
  getReimbursement,
  getAllReimbursement,
  updateReimbursement,
  updateBill,
  deleteBill,
} = require("../controllers/reimbursementController");

const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

const validate = require("../middleware/validate");
const {
  reimbursementSchema,
  updateReimbursementStatusSchema,
} = require("../validators/reimbursement.validator");

// ✅ Apply reimbursement
router.post(
  "/applyReimbursement",
  authMiddleware,
  checkRole(["employee", "manager"]),
  upload.single("bill"),
  fileValidation,
  validate(reimbursementSchema),
  applyReimbursement
);

// ✅ Get own reimbursements
router.get(
  "/getReimbursement",
  authMiddleware,
  checkRole(["employee", "manager"]),
  getReimbursement
);

// ✅ Get all reimbursements
router.get(
  "/getAll",
  authMiddleware,
  checkRole(["admin", "manager"]),
  getAllReimbursement
);

// ✅ Update status
router.put(
  "/update/:id",
  authMiddleware,
  checkRole(["admin", "manager"]),
  validate(updateReimbursementStatusSchema),
  updateReimbursement
);

// ✅ Update bill
router.put(
  "/updateBill/:id",
  authMiddleware,
  checkRole(["employee", "manager"]),
  upload.single("bill"),
  fileValidation,
  updateBill
);

// ✅ Delete bill
router.delete(
  "/deleteBill/:id",
  authMiddleware,
  checkRole(["employee", "manager"]),
  deleteBill
);

module.exports = router;