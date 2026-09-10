const Booking =
    require("../models/Booking");

const PhotographerProfile =
    require("../models/PhotographerProfile");


// =====================================================
// CREATE BOOKING
// CLIENT
// =====================================================

const createBooking = async (
    req,
    res
) => {

    try {

        const {
            photographerId,
            eventType,
            eventDate,
            eventLocation,
            message
        } = req.body;


        if (
            !photographerId ||
            !eventType ||
            !eventDate ||
            !eventLocation
        ) {

            return res.status(400).json({
                message:
                    "Photographer, event type, date and location are required"
            });

        }


        /*
         * photographerId is the USER ID.
         */

        const photographer =
            await PhotographerProfile.findOne({
                user: photographerId
            });


        if (!photographer) {

            return res.status(404).json({
                message:
                    "Photographer profile not found"
            });

        }


        if (!photographer.isAvailable) {

            return res.status(400).json({
                message:
                    "Photographer is currently unavailable"
            });

        }


        /*
         * Prevent client from booking
         * themselves accidentally.
         */

        if (
            req.user.userId.toString() ===
            photographerId.toString()
        ) {

            return res.status(400).json({
                message:
                    "You cannot book yourself"
            });

        }


        const booking =
            await Booking.create({

                client:
                    req.user.userId,

                photographer:
                    photographerId,

                eventType,

                eventDate,

                eventLocation,

                message:
                    message || "",

                price:
                    photographer.pricePerEvent,

                status:
                    "PENDING"

            });


        const populatedBooking =
            await Booking.findById(
                booking._id
            )
                .populate(
                    "client",
                    "name email profileImage"
                )
                .populate(
                    "photographer",
                    "name email profileImage"
                );


        res.status(201).json({

            message:
                "Booking request sent successfully",

            booking:
                populatedBooking

        });


    } catch (error) {

        console.error(
            "Create Booking Error:",
            error
        );

        res.status(500).json({
            message:
                "Server error"
        });

    }

};


// =====================================================
// PHOTOGRAPHER BOOKINGS
// =====================================================

const getPhotographerBookings =
    async (req, res) => {

        try {

            const bookings =
                await Booking.find({

                    photographer:
                        req.user.userId

                })
                    .populate(
                        "client",
                        "name email profileImage"
                    )
                    .populate(
                        "photographer",
                        "name email profileImage"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                bookings

            });


        } catch (error) {

            console.error(
                "Photographer Bookings Error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });

        }

    };


// =====================================================
// ACCEPT
// =====================================================

const acceptBooking =
    async (req, res) => {

        try {

            const booking =
                await Booking.findOne({
                    _id:
                        req.params.bookingId,

                    photographer:
                        req.user.userId
                });


            if (!booking) {

                return res.status(404).json({
                    message:
                        "Booking not found"
                });

            }


            if (
                booking.status !==
                "PENDING"
            ) {

                return res.status(400).json({
                    message:
                        "Only pending bookings can be accepted"
                });

            }


            booking.status =
                "CONFIRMED";


            await booking.save();


            res.status(200).json({

                message:
                    "Booking accepted successfully",

                booking

            });


        } catch (error) {

            console.error(
                "Accept Booking Error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });

        }

    };


// =====================================================
// REJECT
// =====================================================

const rejectBooking =
    async (req, res) => {

        try {

            const booking =
                await Booking.findOne({
                    _id:
                        req.params.bookingId,

                    photographer:
                        req.user.userId
                });


            if (!booking) {

                return res.status(404).json({
                    message:
                        "Booking not found"
                });

            }


            if (
                booking.status !==
                "PENDING"
            ) {

                return res.status(400).json({
                    message:
                        "Only pending bookings can be rejected"
                });

            }


            booking.status =
                "REJECTED";


            await booking.save();


            res.status(200).json({

                message:
                    "Booking rejected successfully",

                booking

            });


        } catch (error) {

            console.error(
                "Reject Booking Error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });

        }

    };


// =====================================================
// CLIENT MY BOOKINGS
// =====================================================

const getMyBookings =
    async (req, res) => {

        try {

            const bookings =
                await Booking.find({

                    client:
                        req.user.userId

                })
                    .populate(
                        "photographer",
                        "name email profileImage"
                    )
                    .populate(
                        "client",
                        "name email profileImage"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                bookings

            });


        } catch (error) {

            console.error(
                "My Bookings Error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
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