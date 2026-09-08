const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const photographerRoutes = require("./routes/photographerRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photographers", photographerRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "SnapBook API is running"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        console.log("🚀 Starting SnapBook server...");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server");
        process.exit(1);
    }
};

startServer();