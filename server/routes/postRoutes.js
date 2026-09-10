const express = require("express");

const {
    createPost,
    getAllPosts,
    getPhotographerPosts,
    toggleLike
} = require("../controllers/postController");

const protect =
    require("../middleware/authMiddleware");

const {
    photographerOnly
} = require("../middleware/roleMiddleware");


const router =
    express.Router();


/* =====================================================
   ALL POSTS
===================================================== */

router.get(
    "/",
    protect,
    getAllPosts
);


/* =====================================================
   CREATE POST
   PHOTOGRAPHER ONLY
===================================================== */

router.post(
    "/",
    protect,
    photographerOnly,
    createPost
);


/* =====================================================
   PHOTOGRAPHER POSTS
===================================================== */

router.get(
    "/photographer/:photographerId",
    protect,
    getPhotographerPosts
);


/* =====================================================
   LIKE / UNLIKE
   ALL AUTHENTICATED USERS
===================================================== */

router.post(
    "/:postId/like",
    protect,
    toggleLike
);


module.exports = router;