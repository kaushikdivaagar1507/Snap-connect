const Post = require("../models/Post");


// ===============================
// CREATE POST
// ===============================
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
            category: category || "OTHER",
            likes: []
        });

        const populatedPost =
            await Post
                .findById(post._id)
                .populate(
                    "photographer",
                    "name email phone profileImage"
                );

        res.status(201).json({
            message: "Post created successfully",
            post: populatedPost
        });

    } catch (error) {
        console.error(
            "Create Post Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET ALL POSTS
// ===============================
const getAllPosts = async (req, res) => {
    try {
        const posts =
            await Post
                .find()
                .populate(
                    "photographer",
                    "name email phone profileImage"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Posts fetched successfully",
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error(
            "Get All Posts Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET PHOTOGRAPHER POSTS
// ===============================
const getPhotographerPosts = async (req, res) => {
    try {
        const {
            photographerId
        } = req.params;

        const posts =
            await Post
                .find({
                    photographer: photographerId
                })
                .populate(
                    "photographer",
                    "name email phone profileImage"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Photographer posts fetched successfully",
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


// ===============================
// LIKE / UNLIKE POST
// ===============================
const toggleLike = async (req, res) => {
    try {
        const {
            postId
        } = req.params;

        const post =
            await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const userId =
            req.user.userId.toString();

        const alreadyLiked =
            post.likes.some(
                id => id.toString() === userId
            );

        if (alreadyLiked) {

            post.likes =
                post.likes.filter(
                    id =>
                        id.toString() !== userId
                );

        } else {

            post.likes.push(
                req.user.userId
            );
        }

        await post.save();

        res.status(200).json({
            message: alreadyLiked
                ? "Post unliked successfully"
                : "Post liked successfully",

            liked: !alreadyLiked,

            likesCount:
                post.likes.length,

            likes:
                post.likes
        });

    } catch (error) {
        console.error(
            "Toggle Like Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createPost,
    getAllPosts,
    getPhotographerPosts,
    toggleLike
};