const express = require("express")
const router = express.Router()

const { applyReimbursement } = require("../controllers/reimbursementController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")


router.post("/applyReimbursement", authMiddleware, checkRole(["employee"]), applyReimbursement)


module.exports=router