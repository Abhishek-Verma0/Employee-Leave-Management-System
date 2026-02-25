const Leave = require("../models/Leave")


const applyLeave = async (req, res)=> {
    try {
        const { fromDate, toDate, reason } = req.body
        
        //  creating leave
        const leave = await Leave.create({
            user: req.user.id,
            fromDate,
            toDate,
            reason
        })

       return res.status(201).json({
            message: "Leave applied successfully",
            leave
        })
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}

//  getting all leaves from db  for  the particular user

const getLeaves = async (req, res) => {
    try {
        const leaves =await Leave.find({ user: req.user.id }).sort({ createdAt: -1 })
      return  res.status(200).json(leaves)

    } catch (err) {
      return  res.status(404).json({ message: err.message })
    }
}

//  getting all user leave for manger role or admin

const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate("user", "email").sort({ createdAt: -1 })
        return res.status(200).json(leaves);
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}


//  updaating leave status

const updateLeave = async(req, res) => {
    try {
        const leaveId = req.params.id
        const { status } = req.body
        
        const leave =await Leave.findById(leaveId).populate("user")
        if (!leave) {
            return res.status(404).json({message:"Leave not found "})
        }

        const applicantRole = leave.user.role
        const approverRole = req.user.role
        if (approverRole === "manager" && applicantRole !== "employee")
        {
            return res.status(403).json({ message: "Managers can only approve employee leaves" });
        }
        if (approverRole === "admin" && applicantRole !== "manager")
        {
            return res.status(403).json({ message: "Admin can only approve manager leaves" });
        }
        leave.status = status
        await leave.save();
        res.status(200).json({message:`Leave ${status} successfully`,leave})
        
    } catch (err) {
        res.status(500).json({message:err.message})
    }
}

module.exports={applyLeave,getLeaves,getAllLeaves,updateLeave}