const express = require("express");
const router = express.Router();

const upload = require("../config/multer"); 
const fileValidation = require("../middleware/fileValidation");

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


router.post(
  "/applyReimbursement",
  authMiddleware,
  checkRole(["employee", "manager"]),
  upload.single("bill"),
  fileValidation,
  validate(reimbursementSchema),
  applyReimbursement
);


router.get(
  "/getReimbursement",
  authMiddleware,
  checkRole(["employee", "manager"]),
  getReimbursement
);


router.get(
  "/getAll",
  authMiddleware,
  checkRole(["admin", "manager"]),
  getAllReimbursement
);


router.put(
  "/update/:id",
  authMiddleware,
  checkRole(["admin", "manager"]),
  validate(updateReimbursementStatusSchema),
  updateReimbursement
);


router.put(
  "/updateBill/:id",
  authMiddleware,
  checkRole(["employee", "manager"]),
  upload.single("bill"),
  fileValidation,
  updateBill
);

router.delete(
  "/deleteBill/:id",
  authMiddleware,
  checkRole(["employee", "manager"]),
  deleteBill
);

module.exports = router;