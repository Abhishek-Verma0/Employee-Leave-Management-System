const Reimbursement = require("../models/Reimbursement")


const applyReimbursement = async (req, res) => {
    try {
        const { amount, expenseDate, description } = req.body
        
        //  creating reimbursement
        const reimbursement = await Reimbursement.create({
            user: req.user.id,
            amount,
            expenseDate,
            description
        })
        return res.status(201).json({
            message: "Reimbursement applied successfully",
            reimbursement
        })
    }
    catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports={applyReimbursement}