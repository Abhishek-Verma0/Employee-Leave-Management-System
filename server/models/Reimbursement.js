const mongoose = require("mongoose")

const reimbursementSchema =new mongoose.Schema({
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    amount: {
        type: Number,
        required: true,
        min:0
    },
    expenseDate: {
        type: Date,
        required:true,
    },
    description: {
        type: String,
        trim: true,
        required:true,
    },
    billUrl: {
        type: String,
        default: null,
    },
    billFileId: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default:"pending"
    }
},
    {
        timestamps:true
    }
)


module.exports= mongoose.model("reimbursement",reimbursementSchema)