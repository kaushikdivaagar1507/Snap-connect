const express = require("express");

const {
    createBooking,
    getPhotographerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings
} = require("../controllers/bookingController");

const protect =
    require("../middleware/authMiddleware");

const {
    clientOnly,
    photographerOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// CLIENT
// ===============================

// Create booking
router.post(
    "/",
    protect,
    clientOnly,
    createBooking
);


// Get client's bookings
router.get(
    "/my",
    protect,
    clientOnly,
    getMyBookings
);


// ===============================
// PHOTOGRAPHER
// ===============================

// Get photographer bookings
router.get(
    "/photographer",
    protect,
    photographerOnly,
    getPhotographerBookings
);


// Accept booking
router.patch(
    "/:bookingId/accept",
    protect,
    photographerOnly,
    acceptBooking
);


// Reject booking
router.patch(
    "/:bookingId/reject",
    protect,
    photographerOnly,
    rejectBooking
);


module.exports = router;