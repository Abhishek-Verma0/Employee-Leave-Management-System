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

//  getting all leaves from db 

const getLeaves = async (req, res) => {
    try {
        const leaves =await Leave.findOne({ user: req.user.id }).sort({ createdAt: -1 })
      return  res.status(200).json(leaves)

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

module.exports={applyLeave,getLeaves}