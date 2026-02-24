const express = require("express")
const router = express.Router()

const { applyLeave ,getLeaves,getAllLeaves} = require("../controllers/leaveController")

const {authMiddleware,checkRole} =require("../middleware/authMiddleware")

router.post("/applyLeave", authMiddleware, checkRole(["employee"]), applyLeave)
router.get("/getLeaves",authMiddleware,checkRole(['employee']),getLeaves)
router.get("/allLeaves",authMiddleware,checkRole(["manager","admin"]),getAllLeaves)
module.exports=router