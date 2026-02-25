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

 module.exports={updateUserRole,getAllUser}