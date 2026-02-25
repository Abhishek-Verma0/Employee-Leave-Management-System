const Reimbursement = require("../models/Reimbursement");

//  apply for reimbursement
const applyReimbursement = async (req, res) => {
  try {
    const { amount, expenseDate, description } = req.body;

    //  creating reimbursement
    const reimbursement = await Reimbursement.create({
      user: req.user.id,
      amount,
      expenseDate,
      description,
    });
    return res.status(201).json({
      message: "Reimbursement applied successfully",
      reimbursement,
    });
  } catch (err) {
  return  res.status(500).json({
      message: err.message,
    });
  }
};

//  getting all remibursment from db for a particular user

const getReimbursement = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({ user: req.user.id }).sort(
      { createdAt: -1 },
    );
    return res.status(200).json(reimbursements);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//  updating reimbursement

const updateReimbursement = async (req, res) => {
  try {
    const reimbursementId = req.params.id;
    const { status } = req.body;

    const reimbursement =
      await Reimbursement.findById(reimbursementId).populate("user");
    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement not found" });
    }
    const applicantRole = reimbursement.user.role;
    const approverRole = req.user.role;

    if (approverRole === "manager" && applicantRole !== "employee") {
      res
        .status(403)
        .json({ message: "Manger can approve only employee reimbursement" });
    }
    if (approverRole === "admin" && applicantRole !== "manager") {
      res
        .status(403)
        .json({ message: "Admin can approve only manager reimbursement" });
    }
    reimbursement.status = status;
    await reimbursement.save();

  return  res.status(200).json({ message: `Reimbursement ${status} successfully`, reimbursement });
  } catch (err) {
   return res.status(500).json({ message: err.message });
  }
};

//  get all reimbursement for admin or manager

const getAllReimbursement = async (req, res) => {
    try {
        
        const reimbursements = await Reimbursement.find({user:{$ne:req.user.id}}).populate("user", "email").sort({ createdAt: -1 })
        return res.status(200).json({ reimbursements })
    } catch (err) {
       return res.status(500).json({message:err.message})
    }
    
}


module.exports = { applyReimbursement, getReimbursement,updateReimbursement,getAllReimbursement };
