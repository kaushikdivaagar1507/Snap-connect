const mongoose = require("mongoose");

const photographerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        bio: {
            type: String,
            default: "",
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        specialization: {
            type: [String],
            default: []
        },

        experience: {
            type: Number,
            default: 0
        },

        pricePerEvent: {
            type: Number,
            required: true
        },

        phone: {
            type: String,
            default: ""
        },

        profileImage: {
            type: String,
            default: ""
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const PhotographerProfile = mongoose.model(
    "PhotographerProfile",
    photographerProfileSchema
);

module.exports = PhotographerProfile;