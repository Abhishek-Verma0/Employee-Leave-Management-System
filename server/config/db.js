const mongoose = require("mongoose")


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("mongo connected")
        
    } catch (err) {
        console.log(err)
    }
}

module.exports=connectDb