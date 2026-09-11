const Comment = require("../models/Comment");
const Post = require("../models/Post");


/* =====================================================
   CREATE COMMENT
===================================================== */

const createComment = async (
    req,
    res
) => {

    try {

        const {
            postId
        } = req.params;


        const {
            text
        } = req.body;


        if (
            !text ||
            !text.trim()
        ) {

            return res.status(400).json({
                message:
                    "Comment cannot be empty"
            });

        }


        const post =
            await Post.findById(
                postId
            );


        if (!post) {

            return res.status(404).json({
                message:
                    "Post not found"
            });

        }


        const comment =
            await Comment.create({

                post: postId,

                user:
                    req.user.userId,

                text:
                    text.trim()

            });


        const populatedComment =
            await Comment.findById(
                comment._id
            )
            .populate(
                "user",
                "name profileImage role"
            );


        res.status(201).json({

            message:
                "Comment added successfully",

            comment:
                populatedComment

        });


    } catch (error) {

        console.error(
            "Create Comment Error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });

    }

};


/* =====================================================
   GET COMMENTS
===================================================== */

const getComments = async (
    req,
    res
) => {

    try {

        const {
            postId
        } = req.params;


        const comments =
            await Comment.find({
                post:
                    postId
            })
            .populate(
                "user",
                "name profileImage role"
            )
            .sort({
                createdAt: 1
            });


        res.status(200).json({
            comments
        });


    } catch (error) {

        console.error(
            "Get Comments Error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });

    }

};


module.exports = {

    createComment,
    getComments

};