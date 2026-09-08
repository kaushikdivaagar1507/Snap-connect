const express = require("express");

const {
    createProfile,
    getMyProfile,
    getPhotographers,
    getPhotographerById,
    updateMyProfile
} = require("../controllers/photographerController");

const protect = require("../middleware/authMiddleware");

const {
    photographerOnly,
    clientOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// Create photographer profile
router.post(
    "/profile",
    protect,
    photographerOnly,
    createProfile
);


// Get my photographer profile
router.get(
    "/profile/me",
    protect,
    photographerOnly,
    getMyProfile
);
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
router.put(
    "/profile",
    protect,
    photographerOnly,
    updateMyProfile
);

module.exports = router;