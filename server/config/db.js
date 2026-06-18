const mongoose = require("mongoose")


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("mongo connected")
        
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

module.exports=connectDb