import { useEffect, useState } from "react";

import {
    getPhotographerBookings,
    acceptBooking,
    rejectBooking
} from "../api/api";


function PhotographerDashboard({ onBack }) {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
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
                await getPhotographerBookings(
                    token
                );


            console.log(
                "📦 Photographer Bookings:",
                data
            );


            setBookings(
                data.bookings || []
            );

        } catch (err) {

            console.error(
                "Fetch Bookings Error:",
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


    const handleAccept = async (
        bookingId
    ) => {

        try {

            setActionLoading(
                bookingId
            );

            setError("");
            setSuccess("");


            const token =
                localStorage.getItem("token");


            await acceptBooking(
                token,
                bookingId
            );


            setSuccess(
                "Booking accepted successfully! 🎉"
            );


            await fetchBookings();

        } catch (err) {

            console.error(
                "Accept Booking Error:",
                err
            );

            setError(
                err.message ||
                "Failed to accept booking"
            );

        } finally {

            setActionLoading(null);

        }

    };


    const handleReject = async (
        bookingId
    ) => {

        try {

            setActionLoading(
                bookingId
            );

            setError("");
            setSuccess("");


            const token =
                localStorage.getItem("token");


            await rejectBooking(
                token,
                bookingId
            );


            setSuccess(
                "Booking rejected."
            );


            await fetchBookings();

        } catch (err) {

            console.error(
                "Reject Booking Error:",
                err
            );

            setError(
                err.message ||
                "Failed to reject booking"
            );

        } finally {

            setActionLoading(null);

        }

    };


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


    const pendingBookings =
        bookings.filter(
            booking =>
                booking.status === "PENDING"
        );


    const confirmedBookings =
        bookings.filter(
            booking =>
                booking.status === "CONFIRMED"
        );


    const rejectedBookings =
        bookings.filter(
            booking =>
                booking.status === "REJECTED"
        );


    if (loading) {

        return (

            <div className="dashboard-page">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>


                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>


                <div>

                    <h1>
                        Photographer Dashboard
                    </h1>

                    <p>
                        Manage your photography
                        bookings
                    </p>

                </div>

            </div>


            {error && (

                <div className="dashboard-error">

                    {error}

                </div>

            )}


            {success && (

                <div className="dashboard-success">

                    {success}

                </div>

            )}


            {/* STATS */}

            <div className="dashboard-stats">

                <div className="dashboard-stat">

                    <span>
                        📋
                    </span>

                    <div>

                        <strong>
                            {bookings.length}
                        </strong>

                        <p>
                            Total Bookings
                        </p>

                    </div>

                </div>


                <div className="dashboard-stat">

                    <span>
                        ⏳
                    </span>

                    <div>

                        <strong>
                            {pendingBookings.length}
                        </strong>

                        <p>
                            Pending
                        </p>

                    </div>

                </div>


                <div className="dashboard-stat">

                    <span>
                        ✓
                    </span>

                    <div>

                        <strong>
                            {confirmedBookings.length}
                        </strong>

                        <p>
                            Confirmed
                        </p>

                    </div>

                </div>


                <div className="dashboard-stat">

                    <span>
                        ✕
                    </span>

                    <div>

                        <strong>
                            {rejectedBookings.length}
                        </strong>

                        <p>
                            Rejected
                        </p>

                    </div>

                </div>

            </div>


            {/* PENDING */}

            <section className="dashboard-section">

                <div className="section-title">

                    <h2>
                        Booking Requests
                    </h2>

                    <span>
                        {pendingBookings.length}
                    </span>

                </div>


                {pendingBookings.length === 0 ? (

                    <div className="empty-dashboard">

                        <div>
                            📭
                        </div>

                        <h3>
                            No pending requests
                        </h3>

                        <p>
                            New client booking requests
                            will appear here.
                        </p>

                    </div>

                ) : (

                    pendingBookings.map(
                        booking => (

                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                formatDate={formatDate}
                                actionLoading={
                                    actionLoading
                                }
                                handleAccept={
                                    handleAccept
                                }
                                handleReject={
                                    handleReject
                                }
                            />

                        )
                    )

                )}

            </section>


            {/* CONFIRMED */}

            <section className="dashboard-section">

                <div className="section-title">

                    <h2>
                        Confirmed Bookings
                    </h2>

                    <span>
                        {confirmedBookings.length}
                    </span>

                </div>


                {confirmedBookings.length === 0 ? (

                    <div className="empty-dashboard">

                        <p>
                            No confirmed bookings yet.
                        </p>

                    </div>

                ) : (

                    confirmedBookings.map(
                        booking => (

                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                formatDate={formatDate}
                                actionLoading={
                                    actionLoading
                                }
                                handleAccept={
                                    handleAccept
                                }
                                handleReject={
                                    handleReject
                                }
                            />

                        )
                    )

                )}

            </section>


            {/* REJECTED */}

            {rejectedBookings.length > 0 && (

                <section className="dashboard-section">

                    <div className="section-title">

                        <h2>
                            Rejected Bookings
                        </h2>

                        <span>
                            {rejectedBookings.length}
                        </span>

                    </div>


                    {rejectedBookings.map(
                        booking => (

                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                formatDate={formatDate}
                                actionLoading={
                                    actionLoading
                                }
                                handleAccept={
                                    handleAccept
                                }
                                handleReject={
                                    handleReject
                                }
                            />

                        )
                    )}

                </section>

            )}

        </div>

    );

}


/* =====================================================
   BOOKING CARD
===================================================== */

function BookingCard({
    booking,
    formatDate,
    actionLoading,
    handleAccept,
    handleReject
}) {

    const client =
        booking.client || {};


    const clientName =
        client.name ||
        "Client";


    return (

        <div className="dashboard-booking-card">

            <div className="dashboard-client">

                <div className="client-avatar">

                    {client.profileImage ? (

                        <img
                            src={
                                client.profileImage
                            }
                            alt={
                                clientName
                            }
                        />

                    ) : (

                        clientName
                            .charAt(0)
                            .toUpperCase()

                    )}

                </div>


                <div>

                    <h3>
                        {clientName}
                    </h3>

                    <p>
                        {client.email ||
                            "No email"}
                    </p>

                </div>

            </div>


            <div className="dashboard-booking-details">

                <div>

                    <span>
                        Event
                    </span>

                    <strong>
                        {booking.eventType}
                    </strong>

                </div>


                <div>

                    <span>
                        Date
                    </span>

                    <strong>
                        {formatDate(
                            booking.eventDate
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Location
                    </span>

                    <strong>
                        📍{" "}
                        {booking.eventLocation}
                    </strong>

                </div>


                <div>

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


            {booking.message && (

                <div className="booking-client-message">

                    <span>
                        Client message
                    </span>

                    <p>
                        "{booking.message}"
                    </p>

                </div>

            )}


            <div className="dashboard-card-footer">

                <span
                    className={`dashboard-status ${
                        booking.status?.toLowerCase()
                    }`}
                >

                    {booking.status ===
                        "PENDING" &&
                        "● Pending"}

                    {booking.status ===
                        "CONFIRMED" &&
                        "✓ Confirmed"}

                    {booking.status ===
                        "REJECTED" &&
                        "✕ Rejected"}

                </span>


                {booking.status ===
                    "PENDING" && (

                    <div className="booking-actions">

                        <button
                            className="accept-button"
                            disabled={
                                actionLoading ===
                                booking._id
                            }
                            onClick={() =>
                                handleAccept(
                                    booking._id
                                )
                            }
                        >

                            {actionLoading ===
                                booking._id
                                ? "Processing..."
                                : "✓ Accept"}

                        </button>


                        <button
                            className="reject-button"
                            disabled={
                                actionLoading ===
                                booking._id
                            }
                            onClick={() =>
                                handleReject(
                                    booking._id
                                )
                            }
                        >

                            {actionLoading ===
                                booking._id
                                ? "Processing..."
                                : "✕ Reject"}

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}


export default PhotographerDashboard;