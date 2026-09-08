const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error("Message:", error.message);

        if (error.reason) {
            console.error("Reason:", error.reason);
        }

        process.exit(1);
    }
};

module.exports = connectDB;