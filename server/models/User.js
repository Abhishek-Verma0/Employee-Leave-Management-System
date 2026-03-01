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
    }
    
},
    {
        timestamps:true
    }
)

module.exports=mongoose.model("User",userSchema)