const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        photographer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        imageUrl: {
            type: String,
            required: true,
            trim: true
        },

        caption: {
            type: String,
            trim: true,
            default: ""
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        category: {
            type: String,
            trim: true,
            default: "OTHER"
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);