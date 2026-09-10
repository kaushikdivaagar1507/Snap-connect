const express = require("express");

const {
    createPost,
    getPhotographerPosts,
    toggleLike,
    getAllPosts
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const {
    photographerOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// CLIENT / ALL USERS - EXPLORE
// ======================================================

router.get(
    "/",
    protect,
    getAllPosts
);


// ======================================================
// PHOTOGRAPHER - CREATE POST
// ======================================================

router.post(
    "/",
    protect,
    photographerOnly,
    createPost
);


// ======================================================
// PHOTOGRAPHER POSTS
// ======================================================

router.get(
    "/photographer/:photographerId",
    protect,
    getPhotographerPosts
);


// ======================================================
// LIKE / UNLIKE
// ======================================================

router.post(
    "/:postId/like",
    protect,
    toggleLike
);


module.exports = router;