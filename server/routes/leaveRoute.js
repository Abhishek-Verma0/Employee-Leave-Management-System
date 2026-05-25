const express = require("express")
const router = express.Router()

const { applyLeave, getLeaves, getAllLeaves, updateLeave, getLeaveBalance } = require("../controllers/leaveController")

const { authMiddleware, checkRole } = require("../middleware/authMiddleware")

const validate = require("../middleware/validate")
const { leaveSchema } = require("../validators/leave.validator")

router.get("/balance", authMiddleware, checkRole(['employee', 'manager']), getLeaveBalance)
router.post("/applyLeave", authMiddleware, checkRole(["employee", "manager"]), validate(leaveSchema), applyLeave)
router.get("/getLeaves", authMiddleware, checkRole(['employee', 'manager']), getLeaves)
router.get("/allLeaves", authMiddleware, checkRole(["manager", "admin"]), getAllLeaves)

router.put("/updateLeave/:id", authMiddleware, checkRole(["admin", "manager"]), updateLeave)
module.exports = router