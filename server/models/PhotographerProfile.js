const mongoose = require("mongoose");

const photographerProfileSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true
            },

            location: {
                type: String,
                default: ""
            },

            specialization: {
                type: String,
                default: ""
            },

            experience: {
                type: Number,
                default: 0
            },

            pricePerEvent: {
                type: Number,
                default: 0
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

module.exports = mongoose.model(
    "PhotographerProfile",
    photographerProfileSchema
);