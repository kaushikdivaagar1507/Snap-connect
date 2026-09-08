const express = require("express");

const {
    createPost,
    getPhotographerPosts,
    getAllPosts,
    toggleLike
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const {
    photographerOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// Create post
router.post(
    "/",
    protect,
    photographerOnly,
    createPost
);


// Get all posts - Home Feed
router.get(
    "/",
    protect,
    getAllPosts
);


// Get posts by photographer
router.get(
    "/photographer/:photographerId",
    protect,
    getPhotographerPosts
);


// Like / Unlike post
router.post(
    "/:postId/like",
    protect,
    toggleLike
);


module.exports = router;