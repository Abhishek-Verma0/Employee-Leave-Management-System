const mongoose = require("mongoose")

const leaveSchema =new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    fromDate: {
        type: Date,
        required:true,
    },
    toDate: {
        type: Date,
        required:true,
    },
    reason: {
        type: String,
        required: true,
        trim :true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default:"pending"
    }
},
    {
        timestamps:true,
    }
)

module.exports=mongoose.model("Leave",leaveSchema)