const express = require("express")
const router = express.Router()

const { applyReimbursement,getReimbursement } = require("../controllers/reimbursementController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")


router.post("/applyReimbursement", authMiddleware, checkRole(["employee"]), applyReimbursement)

router.get("/getReimbursement",authMiddleware,checkRole(['employee']),getReimbursement)


module.exports=router