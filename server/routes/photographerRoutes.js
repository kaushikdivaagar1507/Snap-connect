const express = require("express");

const {
    createProfile,
    getMyProfile,
    updateMyProfile,
    getPhotographers,
    getPhotographerById
} = require("../controllers/photographerController");

const protect = require("../middleware/authMiddleware");

const {
    photographerOnly,
    clientOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PHOTOGRAPHER PROFILE
// ==========================================

router.post(
    "/profile",
    protect,
    photographerOnly,
    createProfile
);

router.put(
    "/profile",
    protect,
    photographerOnly,
    updateMyProfile
);

router.get(
    "/profile/me",
    protect,
    photographerOnly,
    getMyProfile
);


// ==========================================
// CLIENT - PHOTOGRAPHER DISCOVERY
// ==========================================

router.get(
    "/",
    protect,
    clientOnly,
    getPhotographers
);

router.get(
    "/:id",
    protect,
    clientOnly,
    getPhotographerById
);


module.exports = router;