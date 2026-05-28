const Leave = require("../models/Leave")
const mongoose = require("mongoose");

const applyLeave = async (req, res)=> {
    try {
        const { fromDate, toDate, reason } = req.body

        //  validating dates
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: "fromDate and toDate are required" })
        }

        if (new Date(toDate) < new Date(fromDate)) {
            return res.status(400).json({ message: "toDate cannot be before fromDate" })
        }
        
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
      return  res.status(500).json({
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
        const leaves = await Leave.find({user:{$ne:req.user.id}}).populate("user", "name email role").sort({ createdAt: -1 })
        return res.status(200).json(leaves);
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}


//  updaating leave status

const updateLeave = async(req, res) => {
    try {
        const leaveId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(leaveId)) {
            return res.status(400).json({ message: "Invalid leave ID format" });
        }
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
       return res.status(200).json({message:`Leave ${status} successfully`,leave})
        
    } catch (err) {
       return res.status(500).json({message:err.message})
    }
}




module.exports={applyLeave,getLeaves,getAllLeaves,updateLeave}