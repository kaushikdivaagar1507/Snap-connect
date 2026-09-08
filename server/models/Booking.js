const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        photographer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        eventType: {
            type: String,
            required: true,
            trim: true
        },

        eventDate: {
            type: Date,
            required: true
        },

        eventLocation: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "REJECTED",
                "CANCELLED",
                "COMPLETED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;