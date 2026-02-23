const express = require("express")
const connectDb = require("./config/db");
const dotenv=require("dotenv")
const authRoutes=require("./routes/authRoutes")

dotenv.config() // laoding env
//  conncecting db

connectDb()

const app = express()
app.use(express.json());
const port = 3000

//  auth route
app.use("/api/auth",authRoutes)


app.get("/", (req,res) => {
    res.send("Hola")
})



app.listen(port, () => {
    console.log("server running on " + port);
})