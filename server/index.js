const dotenv=require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes")
const reimbursementRoute=require("./routes/reimbursemnetRoute")
const leaveRoute = require("./routes/leaveRoute")
const userRoleRoute=require("./routes/userRoutes")
const path = require("path");

connectDb()

const app = express()
app.use(cors())
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/leave", leaveRoute);
app.use("/api/reimbursement", reimbursementRoute)
app.use("/api/user", userRoleRoute)

// Unified Deployment Logic
if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../client/dist");
    app.use(express.static(clientPath));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Swiftly Server is running in development mode (API only)");
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})