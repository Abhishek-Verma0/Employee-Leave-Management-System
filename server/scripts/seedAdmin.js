/**
 * Admin Seed Script
 *
 * Creates a default admin account or promotes an existing user to admin.
 * Useful for bootstrapping a fresh deployment or when the first-user
 * auto-promotion was missed (e.g. the DB already had users).
 *
 * Usage:
 *   cd server
 *   node scripts/seedAdmin.js
 *
 * Environment variables (optional overrides):
 *   ADMIN_NAME     — defaults to "Admin"
 *   ADMIN_EMAIL    — defaults to "admin@swiftly.local"
 *   ADMIN_PASSWORD — defaults to "admin123456"
 */

const dotenv = require("dotenv");
const path = require("path");

// Load .env from the server directory (one level up from scripts/)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@swiftly.local")
    .trim()
    .toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to MongoDB");

        // Check if any admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log(
                `An admin already exists: ${existingAdmin.email} — skipping seed.`
            );
            process.exit(0);
        }

        // Check if the target email is already registered
        const existingUser = await User.findOne({ email: ADMIN_EMAIL });
        if (existingUser) {
            // Promote the existing user to admin
            existingUser.role = "admin";
            await existingUser.save();
            console.log(
                `Promoted existing user "${existingUser.email}" to admin.`
            );
            process.exit(0);
        }

        // Create a new admin account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
        });

        console.log(`Admin account created successfully!`);
        console.log(`  Email:    ${admin.email}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log(
            `\n⚠  Change the default password after your first login.`
        );
        process.exit(0);
    } catch (err) {
        console.error("Seed failed:", err.message);
        process.exit(1);
    }
}

seedAdmin();
