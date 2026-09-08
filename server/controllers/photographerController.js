const PhotographerProfile = require("../models/PhotographerProfile");


// CREATE PHOTOGRAPHER PROFILE
const createProfile = async (req, res) => {
    try {
        const {
            bio,
            location,
            specialization,
            experience,
            pricePerEvent,
            phone,
            profileImage
        } = req.body;

        if (!location || pricePerEvent === undefined) {
            return res.status(400).json({
                message: "Location and price per event are required"
            });
        }

        // Check if profile already exists
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
            bio,
            location,
            specialization,
            experience,
            pricePerEvent,
            phone,
            profileImage
        });

        res.status(201).json({
            message: "Photographer profile created successfully",
            profile
        });

    } catch (error) {
        console.error("Create Profile Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET MY PHOTOGRAPHER PROFILE
const getMyProfile = async (req, res) => {
    try {
        const profile = await PhotographerProfile.findOne({
            user: req.user.userId
        }).populate("user", "name email");

        if (!profile) {
            return res.status(404).json({
                message: "Photographer profile not found"
            });
        }

        res.status(200).json({
            message: "Photographer profile fetched successfully",
            profile
        });

    } catch (error) {
        console.error("Get Profile Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// GET ALL PHOTOGRAPHERS
// GET ALL PHOTOGRAPHERS (WITH FILTER SUPPORT)
// GET ALL PHOTOGRAPHERS (WITH FIXED FILTERS)
// GET ALL PHOTOGRAPHERS
const getPhotographers = async (req, res) => {
    try {
        const { search, location, specialization, maxPrice } = req.query;

        // Build database query (include accounts where isAvailable is true or undefined)
        let filterQuery = {
            $or: [
                { isAvailable: true },
                { isAvailable: { $exists: false } }
            ]
        };

        // 1. Location Filter
        if (location && location.trim() !== "") {
            filterQuery.location = { $regex: location.trim(), $options: "i" };
        }

        // 2. Specialization Filter
        if (specialization && specialization !== "ALL") {
            const cleanCategory = specialization.replace("_", " ");
            filterQuery.specialization = { 
                $regex: `^${cleanCategory.replace(" ", "[ _-]?")}$`, 
                $options: "i" 
            };
        }

        // 3. Price Filter
        if (maxPrice && !isNaN(Number(maxPrice))) {
            filterQuery.pricePerEvent = { $lte: Number(maxPrice) };
        }

        // Fetch from MongoDB sorted by rating (if present) or newest first
        let photographers = await PhotographerProfile.find(filterQuery)
            .populate("user", "name email profileImage")
            .sort({ rating: -1, createdAt: -1 });

        // 4. Name / Bio Search Filter
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            photographers = photographers.filter((p) => {
                const userName = p.user?.name || "";
                const bio = p.bio || "";
                const loc = p.location || "";
                return (
                    searchRegex.test(userName) || 
                    searchRegex.test(bio) || 
                    searchRegex.test(loc)
                );
            });
        }

        res.status(200).json({
            message: "Photographers fetched successfully",
            count: photographers.length,
            photographers
        });

    } catch (error) {
        console.error("Get Photographers Error:", error.message);
        res.status(500).json({ message: "Server error fetching photographers" });
    }
};

// GET SINGLE PHOTOGRAPHER
const getPhotographerById = async (req, res) => {
    try {
        const { id } = req.params;

        const photographer = await PhotographerProfile.findById(id)
            .populate("user", "name email profileImage");

        if (!photographer) {
            return res.status(404).json({
                message: "Photographer not found"
            });
        }

        res.status(200).json({
            message: "Photographer fetched successfully",
            photographer
        });

    } catch (error) {
        console.error("Get Photographer Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

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

        const profile = await PhotographerProfile.findOne({
            user: req.user.userId
        });

        if (!profile) {
            return res.status(404).json({
                message: "Photographer profile not found"
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

        const updatedProfile = await PhotographerProfile.findById(
            profile._id
        ).populate(
            "user",
            "name email phone profileImage"
        );

        res.status(200).json({
            message: "Photographer profile updated successfully",
            profile: updatedProfile
        });

    } catch (error) {
        console.error(
            "Update Photographer Profile Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createProfile,
    getMyProfile,
    getPhotographers,
    getPhotographerById,
    updateMyProfile
};