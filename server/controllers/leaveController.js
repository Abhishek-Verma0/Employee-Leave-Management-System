const Leave = require("../models/Leave")
const User = require("../models/User")

const applyLeave = async (req, res)=> {
    try {
        const { fromDate, toDate, reason } = req.body

        //  validating dates
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: "fromDate and toDate are required" })
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);

        if (to < from) {
            return res.status(400).json({ message: "toDate cannot be before fromDate" })
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate currently used leave days (only approved ones)
        const approvedLeaves = await Leave.find({ user: req.user.id, status: "approved" });
        let usedDays = 0;
        for (const item of approvedLeaves) {
            const lFrom = new Date(item.fromDate);
            const lTo = new Date(item.toDate);
            usedDays += Math.ceil((lTo - lFrom) / (1000 * 60 * 60 * 24)) + 1;
        }

        const remainingDays = Math.max(0, user.totalLeaveDays - usedDays);
        const requestedDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

        if (requestedDays > remainingDays) {
            return res.status(400).json({
                message: `Requested leave duration (${requestedDays} days) exceeds remaining leave balance (${remainingDays} days)`
            });
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
        const leaves = await Leave.find({user:{$ne:req.user.id}}).populate("user", "email role").sort({ createdAt: -1 })
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
        if (status === "approved") {
            const user = await User.findById(leave.user._id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Calculate currently used leave days (excluding the current leave being approved)
            const approvedLeaves = await Leave.find({ 
                user: leave.user._id, 
                status: "approved",
                _id: { $ne: leaveId }
            });
            let usedDays = 0;
            for (const item of approvedLeaves) {
                const lFrom = new Date(item.fromDate);
                const lTo = new Date(item.toDate);
                usedDays += Math.ceil((lTo - lFrom) / (1000 * 60 * 60 * 24)) + 1;
            }

            const remainingDays = Math.max(0, user.totalLeaveDays - usedDays);
            const requestedDays = Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1;

            if (requestedDays > remainingDays) {
                return res.status(400).json({
                    message: `Cannot approve leave: request duration (${requestedDays} days) exceeds the employee's remaining leave balance (${remainingDays} days)`
                });
            }
        }

        leave.status = status
        await leave.save();
       return res.status(200).json({message:`Leave ${status} successfully`,leave})
        
    } catch (err) {
       return res.status(500).json({message:err.message})
    }
}




const getLeaveBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const approvedLeaves = await Leave.find({ user: req.user.id, status: "approved" });
        let usedDays = 0;
        for (const leave of approvedLeaves) {
            const from = new Date(leave.fromDate);
            const to = new Date(leave.toDate);
            const diffDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
            usedDays += diffDays;
        }

        const remaining = Math.max(0, user.totalLeaveDays - usedDays);
        return res.status(200).json({
            totalLeaveDays: user.totalLeaveDays,
            usedLeaveDays: usedDays,
            remainingLeaveDays: remaining
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports={applyLeave,getLeaves,getAllLeaves,updateLeave,getLeaveBalance}