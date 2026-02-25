const express = require("express")
const router = express.Router()

const { applyReimbursement,getReimbursement ,getAllReimbursement,updateReimbursement} = require("../controllers/reimbursementController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")


router.post("/applyReimbursement", authMiddleware, checkRole(["employee","managerin"]), applyReimbursement)

router.get("/getReimbursement",authMiddleware,checkRole(['employee']),getReimbursement)

router.get("/getAll", authMiddleware, checkRole(["admin", "manager"]), getAllReimbursement)

router.put("/update/:id",authMiddleware,checkRole(["admin","manager"]),updateReimbursement)

module.exports=router