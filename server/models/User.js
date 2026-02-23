const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {type:String,
        reqired: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    role:{
        type: String,
        enum: ["admin", "manager", "employee"],
        default:"employee"
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