const Comment = require("../models/Comment");
const Post = require("../models/Post");


// ==========================================
// CREATE COMMENT
// ==========================================
const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        // Check comment text
        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        // Check whether post exists
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Create comment
        const comment = await Comment.create({
            post: postId,
            user: req.user.userId,
            text: text.trim()
        });

        // Get user details
        await comment.populate(
            "user",
            "name profileImage"
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        console.error(
            "Create Comment Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET COMMENTS
// ==========================================
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({
            post: postId
        })
            .populate("user", "name profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Comments fetched successfully",
            count: comments.length,
            comments
        });

    } catch (error) {
        console.error(
            "Get Comments Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createComment,
    getComments
};