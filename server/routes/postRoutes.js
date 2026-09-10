const express = require("express");

const {
    createPost,
    getPhotographerPosts,
    toggleLike,
    getAllPosts
} = require("../controllers/postController");

const protect =
    require("../middleware/authMiddleware");

const {
    photographerOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// Feed
router.get(
    "/",
    protect,
    getAllPosts
);


// Create post
router.post(
    "/",
    protect,
    photographerOnly,
    createPost
);


// Photographer posts
router.get(
    "/photographer/:photographerId",
    protect,
    getPhotographerPosts
);


// Like / unlike
router.post(
    "/:postId/like",
    protect,
    toggleLike
);


module.exports = router;