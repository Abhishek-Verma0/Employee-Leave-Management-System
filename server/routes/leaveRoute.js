const express = require("express")
const router = express.Router()

const { applyLeave } = require("../controllers/leaveController")

const {authMiddleware,checkRole} =require("../middleware/authMiddleware")

router.post("/applyLeave", authMiddleware,checkRole(["employee"]),applyLeave)

module.exports=router