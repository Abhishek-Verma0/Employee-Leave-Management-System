const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    role:{
        type: String,
        enum: ["admin", "manager", "employee","Approval-Pending"],
        default:"Approval-Pending"
    },
    password: {
        type: String,
        required:true
    },
    totalLeaveDays: {
        type: Number,
        default: 20
    }
    
},
    {
        timestamps:true
    }
);
module.exports=mongoose.model("User",userSchema)
