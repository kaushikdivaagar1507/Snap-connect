const Booking = require("../models/Booking");
const PhotographerProfile = require("../models/PhotographerProfile");


// ==========================================
// CREATE BOOKING
// ==========================================
const createBooking = async (req, res) => {
    try {
        const {
            photographerId,
            eventType,
            eventDate,
            eventLocation,
            message
        } = req.body;

        // Check required fields
        if (
            !photographerId ||
            !eventType ||
            !eventDate ||
            !eventLocation
        ) {
            return res.status(400).json({
                message:
                    "Photographer, event type, event date and event location are required"
            });
        }

        // Find photographer profile
        const photographerProfile =
            await PhotographerProfile.findOne({
                user: photographerId
            });

        if (!photographerProfile) {
            return res.status(404).json({
                message: "Photographer not found"
            });
        }

        // Check photographer availability
        if (!photographerProfile.isAvailable) {
            return res.status(400).json({
                message: "Photographer is currently unavailable"
            });
        }

        // Create booking
        const booking = await Booking.create({
            client: req.user.userId,
            photographer: photographerId,
            eventType,
            eventDate,
            eventLocation,
            message,
            price: photographerProfile.pricePerEvent,
            status: "PENDING"
        });

        res.status(201).json({
            message: "Booking request sent successfully",
            booking
        });

    } catch (error) {
        console.error(
            "Create Booking Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// GET PHOTOGRAPHER BOOKINGS
// ==========================================
const getPhotographerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            photographer: req.user.userId
        })
            .populate("client", "name email phone profileImage")
            .populate(
                "photographer",
                "name email phone profileImage"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Photographer bookings fetched successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(
            "Get Photographer Bookings Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// ACCEPT BOOKING
// ==========================================
const acceptBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Make sure this booking belongs to this photographer
        if (
            booking.photographer.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to manage this booking"
            });
        }

        // Only pending bookings can be accepted
        if (booking.status !== "PENDING") {
            return res.status(400).json({
                message: `Booking cannot be accepted because its status is ${booking.status}`
            });
        }

        booking.status = "CONFIRMED";

        await booking.save();

        res.status(200).json({
            message: "Booking accepted successfully",
            booking
        });

    } catch (error) {
        console.error(
            "Accept Booking Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// REJECT BOOKING
// ==========================================
const rejectBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Make sure this booking belongs to this photographer
        if (
            booking.photographer.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to manage this booking"
            });
        }

        // Only pending bookings can be rejected
        if (booking.status !== "PENDING") {
            return res.status(400).json({
                message: `Booking cannot be rejected because its status is ${booking.status}`
            });
        }

        booking.status = "REJECTED";

        await booking.save();

        res.status(200).json({
            message: "Booking rejected successfully",
            booking
        });

    } catch (error) {
        console.error(
            "Reject Booking Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// GET MY BOOKINGS - CLIENT
// ==========================================
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            client: req.user.userId
        })
            .populate(
                "photographer",
                "name email phone profileImage"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "My bookings fetched successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(
            "Get My Bookings Error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createBooking,
    getPhotographerBookings,
    acceptBooking,
    rejectBooking,
    getMyBookings
};