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



module.exports={applyLeave}