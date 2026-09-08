import { useEffect, useState } from "react";

import {
    getPhotographerBookings,
    acceptBooking,
    rejectBooking
} from "../api/api";


function PhotographerDashboard({ onBack }) {

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // FETCH BOOKINGS
    // ==========================================

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
                await getPhotographerBookings(token);


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


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        fetchBookings();

    }, []);


    // ==========================================
    // ACCEPT BOOKING
    // ==========================================

    const handleAccept = async (bookingId) => {

        try {

            setActionLoading(bookingId);
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


    // ==========================================
    // REJECT BOOKING
    // ==========================================

    const handleReject = async (bookingId) => {

        try {

            setActionLoading(bookingId);
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


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "Not specified";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

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

                    Loading dashboard...

                </div>

            </div>

        );

    }


    // ==========================================
    // FILTER BOOKINGS
    // ==========================================

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


    // ==========================================
    // BOOKING CARD
    // ==========================================

    const BookingCard = ({ booking }) => (

        <div className="dashboard-booking-card">


            {/* CLIENT */}

            <div className="dashboard-client">

                <div className="client-avatar">

                    {booking.client?.profileImage ? (

                        <img
                            src={
                                booking
                                    .client
                                    .profileImage
                            }
                            alt={
                                booking
                                    .client
                                    .name
                            }
                        />

                    ) : (

                        booking.client?.name
                            ?.charAt(0)
                            .toUpperCase() || "C"

                    )}

                </div>


                <div>

                    <h3>

                        {booking.client?.name ||
                            "Client"}

                    </h3>

                    <p>

                        {booking.client?.email ||
                            "No email"}

                    </p>

                </div>

            </div>


            {/* DETAILS */}

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
                        📍 {booking.eventLocation}
                    </strong>

                </div>


                <div>

                    <span>
                        Price
                    </span>

                    <strong>
                        ₹
                        {booking.price?.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>

            </div>


            {/* STATUS / ACTIONS */}

            <div className="dashboard-card-footer">


                <span
                    className={`dashboard-status ${booking.status.toLowerCase()}`}
                >

                    {booking.status === "PENDING"
                        ? "● Pending"
                        : booking.status === "CONFIRMED"
                        ? "✓ Confirmed"
                        : "✕ Rejected"}

                </span>


                {booking.status === "PENDING" && (

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


    // ==========================================
    // MAIN
    // ==========================================

    return (

        <div className="dashboard-page">


            {/* HEADER */}

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


            {/* MESSAGES */}

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


            {/* ==================================
                PENDING
            ================================== */}

            <section className="dashboard-section">

                <div className="section-title">

                    <h2>
                        Pending Requests
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
                            New booking requests will
                            appear here.
                        </p>

                    </div>

                ) : (

                    pendingBookings.map(
                        booking => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                            />
                        )
                    )

                )}

            </section>


            {/* ==================================
                CONFIRMED
            ================================== */}

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
                            />
                        )
                    )

                )}

            </section>


            {/* ==================================
                REJECTED
            ================================== */}

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
                            />
                        )
                    )}

                </section>

            )}

        </div>

    );

}


export default PhotographerDashboard;