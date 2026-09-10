const Post = require("../models/Post");
const User = require("../models/User");
const PhotographerProfile = require("../models/PhotographerProfile");

// ======================================================
// CREATE POST
// ======================================================

const createPost = async (req, res) => {
    try {
        const {
            imageUrl,
            caption,
            location,
            category
        } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                message: "Image URL is required"
            });
        }

        const post = await Post.create({
            photographer: req.user.userId,
            imageUrl,
            caption: caption || "",
            location: location || "",
            category: category || "OTHER"
        });

        const populatedPost = await Post.findById(post._id)
            .populate(
                "photographer",
                "name email profileImage"
            );

        res.status(201).json({
            message: "Photo posted successfully",
            post: populatedPost
        });

    } catch (error) {
        console.error("Create Post Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// GET ALL POSTS - CLIENT EXPLORE
// ======================================================

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate(
                "photographer",
                "name email profileImage"
            )
            .sort({
                createdAt: -1
            });

        const postsWithProfiles = await Promise.all(
            posts.map(async (post) => {

                const profile =
                    await PhotographerProfile.findOne({
                        user: post.photographer._id
                    });

                return {
                    ...post.toObject(),

                    photographerProfile: profile
                        ? {
                              _id: profile._id,
                              location: profile.location,
                              specialization:
                                  profile.specialization,
                              experience:
                                  profile.experience,
                              pricePerEvent:
                                  profile.pricePerEvent,
                              phone: profile.phone,
                              profileImage:
                                  profile.profileImage,
                              isAvailable:
                                  profile.isAvailable
                          }
                        : null
                };
            })
        );

        res.status(200).json({
            count: postsWithProfiles.length,
            posts: postsWithProfiles
        });

    } catch (error) {
        console.error("Get All Posts Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// GET POSTS OF ONE PHOTOGRAPHER
// ======================================================

const getPhotographerPosts = async (req, res) => {
    try {
        const { photographerId } = req.params;

        const posts = await Post.find({
            photographer: photographerId
        })
            .populate(
                "photographer",
                "name email profileImage"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error(
            "Get Photographer Posts Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// LIKE / UNLIKE POST
// ======================================================

const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const userId = req.user.userId;

        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) =>
                    id.toString() !== userId.toString()
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            message: alreadyLiked
                ? "Post unliked"
                : "Post liked",

            likesCount: post.likes.length,

            liked: !alreadyLiked
        });

    } catch (error) {
        console.error("Toggle Like Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    createPost,
    getAllPosts,
    getPhotographerPosts,
    toggleLike
};