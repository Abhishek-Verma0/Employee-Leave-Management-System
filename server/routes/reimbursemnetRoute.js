const express = require("express")
const router = express.Router()
const multer = require("multer")

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const err = new Error("Only images (jpeg, png, gif, webp) and PDF files are allowed!");
        err.statusCode = 400;
        cb(err, false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

const { applyReimbursement, getReimbursement, getAllReimbursement, updateReimbursement, updateBill, deleteBill } = require("../controllers/reimbursementController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")

const validate = require("../middleware/validate")
const { reimbursementSchema, updateReimbursementStatusSchema } = require("../validators/reimbursement.validator")

router.post("/applyReimbursement", authMiddleware, checkRole(["employee", "manager"]), upload.single("bill"),
    validate(reimbursementSchema), applyReimbursement)

router.get("/getReimbursement", authMiddleware, checkRole(['employee', 'manager']), getReimbursement)

router.get("/getAll", authMiddleware, checkRole(["admin", "manager"]), getAllReimbursement)

router.put("/update/:id", authMiddleware, checkRole(["admin", "manager"]),validate(updateReimbursementStatusSchema), updateReimbursement)

router.put("/updateBill/:id", authMiddleware, checkRole(["employee", "manager"]), upload.single("bill"), updateBill)

router.delete("/deleteBill/:id", authMiddleware, checkRole(["employee", "manager"]), deleteBill)

module.exports = router