import { useEffect, useState } from "react";
import { getMyBookings } from "../api/api";

function MyBookings({ onBack }) {

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // FETCH MY BOOKINGS
    // ==========================================

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    setError(
                        "Please login again"
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


        fetchBookings();

    }, []);


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        switch (status) {

            case "CONFIRMED":
                return "confirmed";

            case "REJECTED":
                return "rejected";

            case "PENDING":
            default:
                return "pending";

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

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

                    Loading your bookings...

                </div>

            </div>

        );

    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="bookings-page">
            {/* ==================================
                HEADER
            ================================== */}
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
                        Manage your photography
                        bookings
                    </p>

                </div>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="bookings-error">

                    {error}

                </div>

            )}


            {/* ==================================
                NO BOOKINGS
            ================================== */}

            {!error && bookings.length === 0 && (

                <div className="no-bookings">

                    <div className="no-bookings-icon">
                        📸
                    </div>

                    <h2>
                        No bookings yet
                    </h2>

                    <p>
                        Find a photographer and
                        book your next event.
                    </p>

                </div>

            )}


            {/* ==================================
                BOOKING LIST
            ================================== */}

            <div className="bookings-list">

                {bookings.map((booking) => (

                    <div
                        className="booking-item"
                        key={booking._id}
                    >


                        {/* PHOTOGRAPHER */}

                        <div className="booking-photographer">

                            <div className="booking-avatar">

                                {booking.photographer?.profileImage ? (

                                    <img
                                        src={
                                            booking
                                                .photographer
                                                .profileImage
                                        }
                                        alt={
                                            booking
                                                .photographer
                                                .name
                                        }
                                    />

                                ) : (

                                    booking
                                        .photographer
                                        ?.name
                                        ?.charAt(0)
                                        .toUpperCase()

                                )}

                            </div>


                            <div>

                                <h2>

                                    {booking
                                        .photographer
                                        ?.name ||
                                        "Photographer"}

                                </h2>

                                <p>

                                    📸 Photographer

                                </p>

                            </div>

                        </div>


                        {/* BOOKING DETAILS */}

                        <div className="booking-details">


                            <div className="booking-detail">

                                <span>
                                    Event
                                </span>

                                <strong>
                                    {booking.eventType}
                                </strong>

                            </div>


                            <div className="booking-detail">

                                <span>
                                    Date
                                </span>

                                <strong>

                                    {booking.eventDate
                                        ? new Date(
                                            booking.eventDate
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )
                                        : "Not specified"}

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
                                    {booking.price?.toLocaleString(
                                        "en-IN"
                                    )}

                                </strong>

                            </div>


                        </div>


                        {/* STATUS */}

                        <div className="booking-status-container">

                            <span className="status-label">
                                Status
                            </span>

                            <span
                                className={`booking-status ${getStatusClass(
                                    booking.status
                                )}`}
                            >

                                {booking.status ===
                                "CONFIRMED"
                                    ? "✓ Confirmed"
                                    : booking.status ===
                                      "REJECTED"
                                    ? "✕ Rejected"
                                    : "● Pending"}

                            </span>

                        </div>


                    </div>

                ))}

            </div>

        </div>

    );

}

export default MyBookings;