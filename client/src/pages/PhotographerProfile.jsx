import { useEffect, useState } from "react";

import {
    getPhotographerById,
    getPhotographerPosts,
    createBooking
} from "../api/api";


function PhotographerProfile({
    photographerId,
    onBack
}) {

    // ==========================================
    // PROFILE STATE
    // ==========================================

    const [photographer, setPhotographer] = useState(null);

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // BOOKING STATE
    // ==========================================

    const [showBookingForm, setShowBookingForm] = useState(false);

    const [event, setEvent] = useState("Wedding");

    const [date, setDate] = useState("");

    const [location, setLocation] = useState("");

    const [bookingLoading, setBookingLoading] = useState(false);

    const [bookingMessage, setBookingMessage] = useState("");

    const [bookingError, setBookingError] = useState("");


    // ==========================================
    // FETCH PHOTOGRAPHER PROFILE
    // ==========================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login again");
                    /* CHANGE: Added setLoading(false) here to prevent the UI from getting stuck in an infinite loading state when unauthenticated */
                    setLoading(false);
                    return;
                }


                // Get photographer profile
                const profileData =
                    await getPhotographerById(
                        token,
                        photographerId
                    );


                const profile =
                    profileData.photographer;


                setPhotographer(profile);


                // Get photographer posts
                if (profile?.user?._id) {

                    const postsData =
                        await getPhotographerPosts(
                            token,
                            profile.user._id
                        );


                    setPosts(
                        postsData.posts || []
                    );

                }


            } catch (err) {

                console.error(
                    "Profile Error:",
                    err
                );

                setError(
                    "Failed to load photographer profile"
                );

            } finally {

                setLoading(false);

            }

        };


        if (photographerId) {

            fetchProfile();

        }

    }, [photographerId]);


    // ==========================================
    // BOOK NOW
    // ==========================================

    const handleBookNow = () => {

        setBookingMessage("");
        setBookingError("");

        setShowBookingForm(true);

    };


    // ==========================================
    // CLOSE BOOKING FORM
    // ==========================================

    const handleCloseBooking = () => {

        setShowBookingForm(false);

        setBookingMessage("");
        setBookingError("");

        /* CHANGE: Reset form input states when closing the booking modal */
        setEvent("Wedding");
        setDate("");
        setLocation("");

    };


    // ==========================================
    // CREATE BOOKING
    // ==========================================

    const handleBookingSubmit = async (e) => {

        e.preventDefault();

        setBookingError("");
        setBookingMessage("");


        // Check required fields
        if (!event || !date || !location) {

            setBookingError(
                "Event type, event date and event location are required"
            );

            return;

        }


        // Check photographer information
        if (!photographer?.user?._id) {

            setBookingError(
                "Photographer information is missing"
            );

            return;

        }


        try {

            setBookingLoading(true);


            // Get JWT token
            const token =
                localStorage.getItem("token");


            if (!token) {

                setBookingError(
                    "Please login again"
                );

                return;

            }


            // ==========================================
            // IMPORTANT
            // These names MUST match the backend
            // ==========================================

            const bookingData = {

                photographerId:
                    photographer.user._id,

                eventType:
                    event,

                eventDate:
                    date,

                eventLocation:
                    location

            };


            console.log(
                "📦 Booking Data:",
                bookingData
            );


            // Send booking request
            const data =
                await createBooking(
                    token,
                    bookingData
                );


            console.log(
                "✅ Booking Created:",
                data
            );


            // Show success message
            setBookingMessage(
                "Booking request sent successfully! 🎉"
            );


            // Clear form
            setEvent("Wedding");

            setDate("");

            setLocation("");


        } catch (error) {

            console.error(
                "❌ Booking Error:",
                error
            );


            setBookingError(
                error.message ||
                "Failed to create booking"
            );


        } finally {

            setBookingLoading(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="profile-loading">

                Loading profile...

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="profile-error">

                {error}

            </div>

        );

    }


    // ==========================================
    // PROFILE NOT FOUND
    // ==========================================

    if (!photographer) {

        return (

            <div className="profile-error">

                Photographer not found

            </div>

        );

    }


    // ==========================================
    // MAIN PROFILE
    // ==========================================

    return (

        <div className="photographer-page">


            {/* ==========================================
                BACK BUTTON
            ========================================== */}

            <button
                className="back-button"
                onClick={onBack}
                /* CHANGE: Explicitly specified type="button" to prevent unintended form triggers */
                type="button"
            >

                ← Back

            </button>


            {/* ==========================================
                PROFILE HEADER
            ========================================== */}

            <section className="photographer-header">


                {/* PROFILE IMAGE */}

                <div className="photographer-avatar">

                    {photographer.user?.profileImage ? (

                        <img
                            src={
                                photographer.user.profileImage
                            }
                            alt={
                                photographer.user.name || "Photographer Profile"
                            }
                        />

                    ) : (

                        photographer.user?.name
                            ?.charAt(0)
                            .toUpperCase()

                    )}

                </div>


                {/* PROFILE INFO */}

                <div className="photographer-info">


                    {/* NAME + BUTTONS */}

                    <div className="photographer-name-row">

                        <h1>

                            {photographer.user?.name}

                        </h1>


                        <button
                            className="follow-button"
                            type="button"
                        >

                            Follow

                        </button>


                        <button
                            className="book-button"
                            type="button"
                            onClick={handleBookNow}
                        >

                            Book Now

                        </button>

                    </div>


                    {/* STATS */}

                    <div className="profile-stats">

                        <span>

                            <strong>
                                {posts.length}
                            </strong>{" "}
                            posts

                        </span>


                        <span>

                            <strong>
                                {photographer.experience || 0}
                            </strong>{" "}
                            years experience

                        </span>

                    </div>


                    {/* PROFILE DETAILS */}

                    <div className="profile-details">

                        <strong>

                            {photographer.user?.name}

                        </strong>


                        <p>

                            {photographer.bio ||
                                "Professional photographer"}

                        </p>


                        <p>

                            📍 {photographer.location}

                        </p>


                        <p>

                            📸{" "}

                            {/* CHANGE: Added optional chaining and empty array fallback to prevent runtime errors if specialization is undefined */}
                            {(photographer.specialization || []).join(
                                " • "
                            )}

                        </p>


                        <p>

                            💰 ₹
                            {photographer.pricePerEvent?.toLocaleString(
                                "en-IN"
                            )}{" "}
                            / event

                        </p>


                        <p>

                            📞 {photographer.phone}

                        </p>


                        <p>

                            <span className={
                                photographer.isAvailable
                                    ? "available"
                                    : "unavailable"
                            }>
                                {/* CHANGE: Wrapped textual availability indicator inside a span wrapper for robust CSS targeting */}
                                {photographer.isAvailable
                                    ? "● Available for bookings"
                                    : "● Currently unavailable"}
                            </span>

                        </p>

                    </div>

                </div>

            </section>


            {/* ==========================================
                BOOKING FORM
            ========================================== */}

            {showBookingForm && (

                <section className="booking-section">

                    <div className="booking-card">


                        {/* BOOKING HEADER */}

                        <div className="booking-header">

                            <div>

                                <h2>

                                    Book{" "}
                                    {photographer.user?.name}

                                </h2>

                                <p className="booking-subtitle">

                                    Send a booking request
                                    to the photographer.

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleCloseBooking
                                }
                            >

                                ✕

                            </button>

                        </div>


                        {/* BOOKING FORM */}

                        <form
                            onSubmit={
                                handleBookingSubmit
                            }
                        >


                            {/* ==================================
                                EVENT TYPE
                            ================================== */}

                            <label>
                                Event Type
                            </label>


                            <select
                                value={event}
                                onChange={(e) =>
                                    setEvent(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="Wedding">
                                    Wedding
                                </option>

                                <option value="Candid">
                                    Candid
                                </option>

                                <option value="Pre-Wedding">
                                    Pre-Wedding
                                </option>

                                <option value="Portrait">
                                    Portrait
                                </option>

                                <option value="Fashion">
                                    Fashion
                                </option>

                                <option value="Event">
                                    Event
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>


                            {/* ==================================
                                EVENT DATE
                            ================================== */}

                            <label>
                                Event Date
                            </label>


                            <input
                                type="date"
                                value={date}
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            {/* ==================================
                                EVENT LOCATION
                            ================================== */}

                            <label>
                                Event Location
                            </label>


                            <input
                                type="text"
                                placeholder="Enter event location"
                                value={location}
                                onChange={(e) =>
                                    setLocation(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            {/* ==================================
                                PRICE
                            ================================== */}

                            <div className="booking-price">

                                <span>
                                    Estimated Price
                                </span>


                                <strong>

                                    ₹
                                    {photographer.pricePerEvent?.toLocaleString(
                                        "en-IN"
                                    )}

                                </strong>

                            </div>


                            {/* ==================================
                                SUCCESS MESSAGE
                            ================================== */}

                            {bookingMessage && (

                                <div className="booking-success">

                                    {bookingMessage}

                                </div>

                            )}


                            {/* ==================================
                                ERROR MESSAGE
                            ================================== */}

                            {bookingError && (

                                <div className="booking-error">

                                    {bookingError}

                                </div>

                            )}


                            {/* ==================================
                                CONFIRM BUTTON
                            ================================== */}

                            <button
                                type="submit"
                                className="confirm-booking-button"
                                disabled={bookingLoading}
                            >

                                {bookingLoading
                                    ? "Sending..."
                                    : "Confirm Booking"}

                            </button>


                        </form>

                    </div>

                </section>

            )}


            {/* ==========================================
                PHOTOGRAPHER POSTS
            ========================================== */}

            <section className="photographer-posts">


                {/* POSTS TITLE */}

                <div className="posts-title">

                    <span>
                        ▦
                    </span>

                    <strong>
                        POSTS
                    </strong>

                </div>


                {/* NO POSTS */}

                {posts.length === 0 ? (

                    <div className="no-profile-posts">

                        No posts yet

                    </div>

                ) : (

                    <div className="profile-grid">

                        {posts.map((post) => (

                            <div
                                className="profile-grid-post"
                                key={post._id}
                            >

                                <img
                                    src={post.imageUrl}
                                    alt={
                                        post.caption ||
                                        "Photographer post"
                                    }
                                />


                                <div className="grid-overlay">

                                    <span>

                                        ❤️{" "}
                                        {post.likes?.length || 0}

                                    </span>


                                    <span>

                                        💬

                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


        </div>

    );

}


export default PhotographerProfile;