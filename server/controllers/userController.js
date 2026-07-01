const User = require("../models/User")


//  upadte user role


const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body; 

       
        if (!["employee", "manager"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin' && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: "Cannot demote the last admin in the system." });
            }
        }

        // Apply the promotion or demotion!
        user.role = role;
        await user.save();

        res.status(200).json({ message: `User role updated to ${role}`, user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//  get all user

const getAllUser = async (req, res) => {
    try {
        
        const user = await User.find({}).select("-password") // line not send pass to the frontend
        
        return res.status(200).json({user})
    } catch (err) {
        res.status(404).json({message:err.message})
    }
}

//  delete User
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message:"user not found"})
        }

        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: "Cannot delete the last admin in the system." });
            }
        }

        await User.findByIdAndDelete(userId);
        return res.status(200).json({message:"User deleted successfully"})

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
 module.exports={updateUserRole,getAllUser,deleteUser}