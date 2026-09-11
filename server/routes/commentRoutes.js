const express = require("express");

const {
    createComment,
    getComments
} = require("../controllers/commentController");

const protect =
    require("../middleware/authMiddleware");


const router =
    express.Router();


/* =====================================================
   CREATE COMMENT
===================================================== */

router.post(
    "/:postId/comments",
    protect,
    createComment
);


/* =====================================================
   GET COMMENTS
===================================================== */

router.get(
    "/:postId/comments",
    protect,
    getComments
);


module.exports = router;