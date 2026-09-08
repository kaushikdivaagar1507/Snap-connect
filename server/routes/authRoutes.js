const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const {
    photographerOnly,
    clientOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/me", protect, (req, res) => {
    res.json({
        message: "You are authenticated!",
        user: req.user
    });
});


router.get(
    "/photographer-test",
    protect,
    photographerOnly,
    (req, res) => {
        res.json({
            message: "Welcome Photographer! 📸",
            user: req.user
        });
    }
);


router.get(
    "/client-test",
    protect,
    clientOnly,
    (req, res) => {
        res.json({
            message: "Welcome Client! 👤",
            user: req.user
        });
    }
);


module.exports = router;