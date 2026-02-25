const express = require("express")
const router = express.Router()



const { updateUserRole ,getAllUser} = require("../controllers/userController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")


router.put("/updateRole/:id", authMiddleware, checkRole(["admin"]), updateUserRole)

router.get("/getUsers", authMiddleware, checkRole(["admin"]), getAllUser)

module.exports=router