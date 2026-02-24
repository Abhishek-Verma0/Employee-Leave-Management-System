const express = require("express")
const router = express.Router()

const { applyLeave ,getLeaves} = require("../controllers/leaveController")

const {authMiddleware,checkRole} =require("../middleware/authMiddleware")

router.post("/applyLeave", authMiddleware, checkRole(["employee"]), applyLeave)
router.get("/getLeaves",authMiddleware,checkRole(['employee']),getLeaves)

module.exports=router