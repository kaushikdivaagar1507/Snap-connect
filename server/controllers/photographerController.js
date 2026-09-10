const PhotographerProfile = require("../models/PhotographerProfile");

// ==========================================
// CREATE PHOTOGRAPHER PROFILE
// ==========================================
const createProfile = async (req, res) => {
    try {
        const {
            location,
            specialization,
            experience,
            pricePerEvent,
            phone,
            profileImage,
            isAvailable
        } = req.body;

        const existingProfile = await PhotographerProfile.findOne({
            user: req.user.userId
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Photographer profile already exists"
            });
        }

        const profile = await PhotographerProfile.create({
            user: req.user.userId,
            location: location || "",
            specialization: specialization || "",
            experience: experience || 0,
            pricePerEvent: pricePerEvent || 0,
            phone: phone || "",
            profileImage: profileImage || "",
            isAvailable:
                isAvailable !== undefined
                    ? isAvailable
                    : true
        });

        const populatedProfile =
            await PhotographerProfile
                .findById(profile._id)
                .populate(
                    "user",
                    "name email phone profileImage"
                );

        res.status(201).json({
            message:
                "Photographer profile created successfully",
            profile: populatedProfile
        });

    } catch (error) {
        console.error(
            "Create Profile Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET MY PHOTOGRAPHER PROFILE
// ==========================================
const getMyProfile = async (req, res) => {
    try {
        const profile =
            await PhotographerProfile
                .findOne({
                    user: req.user.userId
                })
                .populate(
                    "user",
                    "name email phone profileImage"
                );

        if (!profile) {
            return res.status(404).json({
                message:
                    "Photographer profile not found"
            });
        }

        res.status(200).json({
            message:
                "Photographer profile fetched successfully",
            profile
        });

    } catch (error) {
        console.error(
            "Get My Profile Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE MY PHOTOGRAPHER PROFILE
// ==========================================
const updateMyProfile = async (req, res) => {
    try {
        const {
            location,
            specialization,
            experience,
            pricePerEvent,
            phone,
            isAvailable,
            profileImage
        } = req.body;

        const profile =
            await PhotographerProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {
            return res.status(404).json({
                message:
                    "Photographer profile not found"
            });
        }

        if (location !== undefined) {
            profile.location = location;
        }

        if (specialization !== undefined) {
            profile.specialization = specialization;
        }

        if (experience !== undefined) {
            profile.experience = experience;
        }

        if (pricePerEvent !== undefined) {
            profile.pricePerEvent = pricePerEvent;
        }

        if (phone !== undefined) {
            profile.phone = phone;
        }

        if (isAvailable !== undefined) {
            profile.isAvailable = isAvailable;
        }

        if (profileImage !== undefined) {
            profile.profileImage = profileImage;
        }

        await profile.save();

        const updatedProfile =
            await PhotographerProfile
                .findById(profile._id)
                .populate(
                    "user",
                    "name email phone profileImage"
                );

        res.status(200).json({
            message:
                "Photographer profile updated successfully",
            profile: updatedProfile
        });

    } catch (error) {
        console.error(
            "Update Profile Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET ALL PHOTOGRAPHERS
// ==========================================
const getPhotographers = async (req, res) => {
    try {
        const photographers =
            await PhotographerProfile
                .find({
                    isAvailable: true
                })
                .populate(
                    "user",
                    "name email phone profileImage"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Photographers fetched successfully",
            count: photographers.length,
            photographers
        });

    } catch (error) {
        console.error(
            "Get Photographers Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET PHOTOGRAPHER BY PROFILE ID
// ==========================================
const getPhotographerById = async (req, res) => {
    try {
        const { id } = req.params;

        const photographer =
            await PhotographerProfile
                .findById(id)
                .populate(
                    "user",
                    "name email phone profileImage"
                );

        if (!photographer) {
            return res.status(404).json({
                message: "Photographer not found"
            });
        }

        res.status(200).json({
            message:
                "Photographer fetched successfully",
            photographer
        });

    } catch (error) {
        console.error(
            "Get Photographer Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
    createProfile,
    getMyProfile,
    updateMyProfile,
    getPhotographers,
    getPhotographerById
};