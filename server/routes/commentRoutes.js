const express = require("express");

const {
    createComment,
    getComments
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Add comment
router.post(
    "/:postId/comments",
    protect,
    createComment
);


// Get comments
router.get(
    "/:postId/comments",
    protect,
    getComments
);


module.exports = router;