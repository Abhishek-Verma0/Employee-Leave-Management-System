const mongoose = require("mongoose")

const reimbursementSchema =new mongoose.Schema({
   
    user: {
        types: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required,
    },
    amount: {
        types: Number,
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
    status: {
        types: String,
        enum: ["pending", "approved", "rejected"],
        default:"pending"
    }
},
    {
        timestamps:true
    }
)


module.exports= mongoose.model("reimbursement",reimbursementSchema)