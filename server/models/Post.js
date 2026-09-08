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
            default: "",
            trim: true
        },

        location: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            enum: [
                "WEDDING",
                "PRE_WEDDING",
                "PORTRAIT",
                "FASHION",
                "EVENT",
                "NATURE",
                "OTHER"
            ],
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

const Post = mongoose.model("Post", postSchema);

module.exports = Post;