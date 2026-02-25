const dotenv=require("dotenv")
dotenv.config() // loading env — must be before other requires that use process.env

const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes")
const reimbursementRoute=require("./routes/reimbursemnetRoute")

const leaveRoute = require("./routes/leaveRoute")
const userRoleRoute=require("./routes/userRoutes")
const path = require("path");

//  connecting db

connectDb()

const app = express()
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 3000

//  auth route
app.use("/api/auth", authRoutes)

//  apply leave
app.use("/api/leave", leaveRoute);

// apply reimbursement
app.use("/api/reimbursement", reimbursementRoute)

// update User Role
app.use("/api/user",userRoleRoute)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all route to serve the React index.html for any non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})