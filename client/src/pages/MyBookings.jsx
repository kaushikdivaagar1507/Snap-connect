import { useEffect, useState } from "react";

import {
    getMyBookings
} from "../api/api";


function MyBookings({ onBack }) {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const fetchBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Please login again."
                );

                return;
            }


            const data =
                await getMyBookings(token);


            console.log(
                "📦 My Bookings:",
                data
            );


            setBookings(
                data.bookings || []
            );

        } catch (err) {

            console.error(
                "My Bookings Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load bookings"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchBookings();

    }, []);


    const formatDate = (date) => {

        if (!date) {
            return "Not specified";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    const getStatusText = (status) => {

        if (status === "CONFIRMED") {
            return "✓ Confirmed";
        }

        if (status === "REJECTED") {
            return "✕ Rejected";
        }

        return "● Pending";

    };


    if (loading) {

        return (

            <div className="bookings-page">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div className="bookings-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your bookings...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="bookings-page">

            <div className="bookings-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>


                <div>

                    <h1>
                        My Bookings
                    </h1>

                    <p>
                        Track your photography
                        bookings
                    </p>

                </div>

            </div>


            {error && (

                <div className="bookings-error">

                    {error}

                    <button
                        onClick={fetchBookings}
                    >
                        Retry
                    </button>

                </div>

            )}


            {!error &&
                bookings.length === 0 && (

                    <div className="no-bookings">

                        <div className="no-bookings-icon">
                            📅
                        </div>

                        <h2>
                            No bookings yet
                        </h2>

                        <p>
                            Find a photographer and
                            book them for your next
                            special event.
                        </p>

                    </div>

                )}


            <div className="bookings-list">

                {bookings.map((booking) => {

                    const photographer =
                        booking.photographer;


                    const photographerName =
                        photographer?.name ||
                        "Photographer";


                    const photographerImage =
                        photographer?.profileImage ||
                        "";


                    return (

                        <div
                            className="booking-item"
                            key={booking._id}
                        >

                            <div className="booking-photographer">

                                <div className="booking-avatar">

                                    {photographerImage ? (

                                        <img
                                            src={
                                                photographerImage
                                            }
                                            alt={
                                                photographerName
                                            }
                                        />

                                    ) : (

                                        <span>

                                            {photographerName
                                                .charAt(0)
                                                .toUpperCase()}

                                        </span>

                                    )}

                                </div>


                                <div className="booking-details">

                                    <h3>
                                        {photographerName}
                                    </h3>

                                    <p>
                                        📷{" "}
                                        {booking.eventType}
                                    </p>

                                </div>

                            </div>


                            <div className="booking-information">

                                <div className="booking-detail">

                                    <span>
                                        Event Date
                                    </span>

                                    <strong>
                                        {formatDate(
                                            booking.eventDate
                                        )}
                                    </strong>

                                </div>


                                <div className="booking-detail">

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        📍{" "}
                                        {booking.eventLocation}
                                    </strong>

                                </div>


                                <div className="booking-detail">

                                    <span>
                                        Price
                                    </span>

                                    <strong>
                                        ₹
                                        {(
                                            booking.price ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <div className="booking-status-container">

                                <span
                                    className={`booking-status ${
                                        booking.status?.toLowerCase()
                                    }`}
                                >

                                    {getStatusText(
                                        booking.status
                                    )}

                                </span>


                                <span className="booking-status-message">

                                    {booking.status ===
                                        "PENDING" &&
                                        "Waiting for photographer"}

                                    {booking.status ===
                                        "CONFIRMED" &&
                                        "Photographer accepted your booking"}

                                    {booking.status ===
                                        "REJECTED" &&
                                        "Photographer rejected this booking"}

                                </span>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default MyBookings;