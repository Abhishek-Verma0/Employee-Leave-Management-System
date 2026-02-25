const express = require("express")
const router = express.Router()
const multer = require("multer")

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB limit

const { applyReimbursement, getReimbursement, getAllReimbursement, updateReimbursement, updateBill, deleteBill } = require("../controllers/reimbursementController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")


router.post("/applyReimbursement", authMiddleware, checkRole(["employee", "manager"]), upload.single("bill"), applyReimbursement)

router.get("/getReimbursement", authMiddleware, checkRole(['employee', 'manager']), getReimbursement)

router.get("/getAll", authMiddleware, checkRole(["admin", "manager"]), getAllReimbursement)

router.put("/update/:id", authMiddleware, checkRole(["admin", "manager"]), updateReimbursement)

router.put("/updateBill/:id", authMiddleware, checkRole(["employee", "manager"]), upload.single("bill"), updateBill)

router.delete("/deleteBill/:id", authMiddleware, checkRole(["employee", "manager"]), deleteBill)

module.exports = router