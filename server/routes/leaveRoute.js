const express = require("express")
const router = express.Router()

const { applyLeave ,getLeaves,getAllLeaves,updateLeave} = require("../controllers/leaveController")

const {authMiddleware,checkRole} =require("../middleware/authMiddleware")

router.post("/applyLeave", authMiddleware, checkRole(["employee"]), applyLeave)
router.get("/getLeaves",authMiddleware,checkRole(['employee']),getLeaves)
router.get("/allLeaves", authMiddleware, checkRole(["manager", "admin"]), getAllLeaves)

router.put("/updateLeave/:id",authMiddleware,checkRole(["admin","manager"]),updateLeave)
module.exports=router