const express = require("express")
const router = express.Router()
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),

    limits: { fileSize: 5 * 1024 * 1024 },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }  else {
            const error = new Error("Only PNG, JPG, JPEG, and PDF files are allowed");
            error.statusCode = 400;
            cb(error);
         }
        }
    }
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
