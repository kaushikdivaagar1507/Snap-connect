const Comment = require("../models/Comment");


// ===============================
// CREATE COMMENT
// ===============================
const createComment = async (req, res) => {
    try {
        const {
            postId
        } = req.params;

        const {
            text
        } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const comment =
            await Comment.create({
                post: postId,
                user: req.user.userId,
                text: text.trim()
            });

        const populatedComment =
            await Comment
                .findById(comment._id)
                .populate(
                    "user",
                    "name email profileImage"
                );

        res.status(201).json({
            message:
                "Comment added successfully",
            comment: populatedComment
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


// ===============================
// GET COMMENTS
// ===============================
const getComments = async (req, res) => {
    try {
        const {
            postId
        } = req.params;

        const comments =
            await Comment
                .find({
                    post: postId
                })
                .populate(
                    "user",
                    "name email profileImage"
                )
                .sort({
                    createdAt: 1
                });

        res.status(200).json({
            message:
                "Comments fetched successfully",
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