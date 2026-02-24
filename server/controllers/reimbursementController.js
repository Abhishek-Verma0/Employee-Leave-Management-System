const Reimbursement = require("../models/Reimbursement")

//  apply for reimbursement
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

//  getting all remibursment from db

const getReimbursement = async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({ user: req.user.id }).sort({ createdAt: -1 })
        return res.status(200).json(reimbursements);
    }
    catch (err) {
        
        return res.status(404).json({message:err.message})
    }
}

module.exports={applyReimbursement,getReimbursement}