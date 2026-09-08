const Post = require("../models/Post");


// CREATE POST
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
            caption,
            location,
            category
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create Post Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// GET POSTS BY PHOTOGRAPHER
const getPhotographerPosts = async (req, res) => {
    try {
        const { photographerId } = req.params;

        const posts = await Post.find({
            photographer: photographerId
        })
            .populate("photographer", "name email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Photographer posts fetched successfully",
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error("Get Photographer Posts Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// GET ALL POSTS - HOME FEED
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("photographer", "name email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All posts fetched successfully",
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error("Get All Posts Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// ==========================================
// LIKE / UNLIKE POST
// ==========================================
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

        // Check if user already liked the post
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {

            // Unlike
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );

            await post.save();

            return res.status(200).json({
                message: "Post unliked successfully",
                liked: false,
                likesCount: post.likes.length
            });
        }

        // Like
        post.likes.push(userId);

        await post.save();

        res.status(200).json({
            message: "Post liked successfully",
            liked: true,
            likesCount: post.likes.length
        });

    } catch (error) {
        console.error("Like Post Error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createPost,
    getPhotographerPosts,
    getAllPosts,
    toggleLike
};