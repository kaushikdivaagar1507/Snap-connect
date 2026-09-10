const Post = require("../models/Post");
const User = require("../models/User");
const PhotographerProfile = require("../models/PhotographerProfile");


/* =====================================================
   CREATE POST
===================================================== */

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

            photographer:
                req.user.userId,

            imageUrl,

            caption:
                caption || "",

            location:
                location || "",

            category:
                category || "Photography",

            likes: []

        });


        const populatedPost =
            await Post.findById(
                post._id
            )
            .populate(
                "photographer",
                "name email profileImage role"
            );


        const profile =
            await PhotographerProfile.findOne({
                user:
                    req.user.userId
            });


        const postObject =
            populatedPost.toObject();


        postObject.photographerProfile =
            profile || null;


        postObject.likedByMe =
            false;


        res.status(201).json({

            message:
                "Post created successfully",

            post:
                postObject

        });


    } catch (error) {

        console.error(
            "Create Post Error:",
            error
        );


        res.status(500).json({
            message: "Server error"
        });

    }

};


/* =====================================================
   GET ALL POSTS
   Latest → Oldest
===================================================== */

const getAllPosts = async (req, res) => {

    try {

        const currentUserId =
            req.user.userId;


        const posts =
            await Post.find()

                .populate(
                    "photographer",
                    "name email profileImage role"
                )

                .sort({
                    createdAt: -1
                });


        const postsWithProfiles =
            await Promise.all(

                posts.map(
                    async post => {

                        const profile =
                            await PhotographerProfile.findOne({
                                user:
                                    post.photographer._id
                            });


                        const postObject =
                            post.toObject();


                        /*
                           Check whether the
                           CURRENT logged-in user
                           has liked this post.
                        */

                        const likedByMe =
                            post.likes.some(
                                id =>
                                    id.toString() ===
                                    currentUserId.toString()
                            );


                        return {

                            ...postObject,

                            photographerProfile:
                                profile || null,

                            likedByMe

                        };

                    }
                )

            );


        res.status(200).json({

            posts:
                postsWithProfiles

        });


    } catch (error) {

        console.error(
            "Get All Posts Error:",
            error
        );


        res.status(500).json({
            message: "Server error"
        });

    }

};


/* =====================================================
   GET PHOTOGRAPHER POSTS
   Latest → Oldest
===================================================== */

const getPhotographerPosts =
    async (
        req,
        res
    ) => {

        try {

            const {
                photographerId
            } = req.params;


            const currentUserId =
                req.user.userId;


            const posts =
                await Post.find({

                    photographer:
                        photographerId

                })

                .populate(
                    "photographer",
                    "name email profileImage role"
                )

                .sort({
                    createdAt: -1
                });


            const postsWithProfiles =
                await Promise.all(

                    posts.map(
                        async post => {

                            const profile =
                                await PhotographerProfile.findOne({
                                    user:
                                        post.photographer._id
                                });


                            const postObject =
                                post.toObject();


                            const likedByMe =
                                post.likes.some(
                                    id =>
                                        id.toString() ===
                                        currentUserId.toString()
                                );


                            return {

                                ...postObject,

                                photographerProfile:
                                    profile || null,

                                likedByMe

                            };

                        }
                    )

                );


            res.status(200).json({

                posts:
                    postsWithProfiles

            });


        } catch (error) {

            console.error(
                "Get Photographer Posts Error:",
                error
            );


            res.status(500).json({
                message: "Server error"
            });

        }

    };


/* =====================================================
   LIKE / UNLIKE POST
   ALL AUTHENTICATED USERS
===================================================== */

const toggleLike =
    async (
        req,
        res
    ) => {

        try {

            const {
                postId
            } = req.params;


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


            const userId =
                req.user.userId;


            /*
               Check whether this user
               already liked the post.
            */

            const alreadyLiked =
                post.likes.some(
                    id =>
                        id.toString() ===
                        userId.toString()
                );


            if (alreadyLiked) {

                /*
                   UNLIKE
                */

                post.likes =
                    post.likes.filter(
                        id =>
                            id.toString() !==
                            userId.toString()
                    );

            } else {

                /*
                   LIKE
                */

                post.likes.push(
                    userId
                );

            }


            await post.save();


            /*
               Return the current state
               to the frontend.
            */

            res.status(200).json({

                message:
                    alreadyLiked
                        ? "Post unliked"
                        : "Post liked",

                likes:
                    post.likes,

                likedByMe:
                    !alreadyLiked

            });


        } catch (error) {

            console.error(
                "Toggle Like Error:",
                error
            );


            res.status(500).json({
                message:
                    "Server error"
            });

        }

    };


module.exports = {

    createPost,

    getAllPosts,

    getPhotographerPosts,

    toggleLike

};