const express = require("express")
const router = express.Router()



const { updateUserRole ,getAllUser,deleteUser} = require("../controllers/userController")
const { authMiddleware, checkRole } = require("../middleware/authMiddleware")
const validate = require("../middleware/validate");                          
const { updateUserRoleSchema } = require("../validators/user.validator"); 


router.put("/updateRole/:id", authMiddleware, checkRole(["admin"]),validate(updateUserRoleSchema), updateUserRole)

router.get("/getUsers", authMiddleware, checkRole(["admin"]), getAllUser)
router.delete("/deleteUser/:id",authMiddleware,checkRole(["admin"]),deleteUser)

module.exports=router