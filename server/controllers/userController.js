const User = require("../models/User")
const mongoose = require("mongoose");


//  upadte user role


const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }
        const { role } = req.body; 

       
        if (!["employee", "manager"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role specified" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Apply the promotion or demotion!
        user.role = role;
        await user.save();

        res.status(200).json({ success: true, message: `User role updated to ${role}`, user });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


//  get all user

const getAllUser = async (req, res) => {
    try {
        
        const user = await User.find({}).select("-password") // line not send pass to the frontend
        
        return res.status(200).json({ success: true, user })
    } catch (err) {
        res.status(404).json({ success: false, message: err.message })
    }
}

//  delete User
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }
        const deleteduser = await User.findByIdAndDelete(userId)
        if (!deleteduser) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" })

    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
 module.exports={updateUserRole,getAllUser,deleteUser}