const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const PhotographerProfile =
    require("../models/PhotographerProfile");


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        // Check existing user
        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Only allow CLIENT or PHOTOGRAPHER
        const selectedRole =
            role === "PHOTOGRAPHER"
                ? "PHOTOGRAPHER"
                : "CLIENT";

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: selectedRole
        });

        // Automatically create photographer profile
        if (selectedRole === "PHOTOGRAPHER") {
            await PhotographerProfile.create({
                user: user._id,
                location: "",
                specialization: "",
                experience: 0,
                pricePerEvent: 0,
                phone: "",
                profileImage: "",
                isAvailable: true
            });
        }

        res.status(201).json({
            message:
                "User registered successfully",

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage:
                    user.profileImage || ""
            }
        });

    } catch (error) {

        console.error(
            "Register Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const user =
            await User.findOne({
                email: email.toLowerCase()
            });

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage:
                    user.profileImage || ""
            }
        });

    } catch (error) {

        console.error(
            "Login Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};