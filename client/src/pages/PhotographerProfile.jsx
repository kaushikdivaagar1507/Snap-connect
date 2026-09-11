import { useEffect, useState } from "react";

import {
    getPhotographerById,
    getPhotographerPosts,
    createBooking
} from "../api/api";


function PhotographerProfile({
    photographer,
    onBack
}) {

    const [profile, setProfile] = useState(
        photographer
    );

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showBooking, setShowBooking] =
        useState(false);

    const [bookingLoading, setBookingLoading] =
        useState(false);

    const [bookingSuccess, setBookingSuccess] =
        useState("");

    const [bookingError, setBookingError] =
        useState("");


    const [form, setForm] = useState({
        eventType: "WEDDING",
        eventDate: "",
        eventLocation: "",
        message: ""
    });


    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Please login again."
                    );
                }


                /*
                 * photographer._id is the
                 * PhotographerProfile ID.
                 */

                const profileData =
                    await getPhotographerById(
                        token,
                        photographer._id
                    );


                setProfile(
                    profileData.photographer ||
                    profileData
                );


                /*
                 * Posts are connected to the
                 * photographer USER ID.
                 */

                const photographerUserId =
                    photographer.user?._id ||
                    profileData.photographer?.user?._id ||
                    profileData.user?._id;


                if (photographerUserId) {

                    const postsData =
                        await getPhotographerPosts(
                            token,
                            photographerUserId
                        );


                    setPosts(
                        postsData.posts || []
                    );
                }

            } catch (error) {

                console.error(
                    "Profile Loading Error:",
                    error
                );

                setBookingError(
                    error.message ||
                    "Failed to load profile"
                );

            } finally {

                setLoading(false);

            }

        };


        loadProfile();

    }, [photographer]);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const handleBooking = async (e) => {

        e.preventDefault();

        setBookingError("");
        setBookingSuccess("");


        if (!form.eventType) {

            setBookingError(
                "Please select an event type."
            );

            return;
        }


        if (!form.eventDate) {

            setBookingError(
                "Please select an event date."
            );

            return;
        }


        if (!form.eventLocation.trim()) {

            setBookingError(
                "Please enter the event location."
            );

            return;
        }


        const photographerUserId =
            profile.user?._id ||
            photographer.user?._id;


        if (!photographerUserId) {

            setBookingError(
                "Photographer information is missing."
            );

            return;
        }


        try {

            setBookingLoading(true);


            const token =
                localStorage.getItem("token");


            if (!token) {

                throw new Error(
                    "Please login again."
                );

            }


            const bookingData = {

                photographerId:
                    photographerUserId,

                eventType:
                    form.eventType,

                eventDate:
                    form.eventDate,

                eventLocation:
                    form.eventLocation,

                message:
                    form.message

            };


            console.log(
                "📸 Creating Booking:",
                bookingData
            );


            await createBooking(
                token,
                bookingData
            );


            setBookingSuccess(
                "Booking request sent successfully! 🎉"
            );


            setForm({
                eventType: "WEDDING",
                eventDate: "",
                eventLocation: "",
                message: ""
            });


            /*
             * Keep the success message visible
             * for a moment, then close modal.
             */

            setTimeout(() => {

                setShowBooking(false);

                setBookingSuccess("");

            }, 1800);


        } catch (error) {

            console.error(
                "Booking Error:",
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


    if (loading) {

        return (

            <div className="photographer-profile-page">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div className="profile-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading photographer profile...
                    </p>

                </div>

            </div>

        );

    }


    const user =
        profile?.user ||
        photographer?.user ||
        {};


    const name =
        user.name ||
        profile?.name ||
        "Photographer";


    const profileImage =
        profile?.profileImage ||
        user.profileImage ||
        "";


    const location =
        profile?.location ||
        "Location not specified";


    const specialization =
        profile?.specialization ||
        "Photography";


    const experience =
        profile?.experience ?? 0;


    const price =
        profile?.pricePerEvent ?? 0;


    const isAvailable =
        profile?.isAvailable !== false;


    return (

        <div className="photographer-profile-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="profile-topbar">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <span className="profile-topbar-title">
                    Photographer Profile
                </span>

            </div>


            {/* =========================================
                PROFILE HEADER
            ========================================= */}

            <section className="photographer-profile-header">

                <div className="large-profile-avatar">

                    {profileImage ? (

                        <img
                            src={profileImage}
                            alt={name}
                        />

                    ) : (

                        <span>
                            {name
                                .charAt(0)
                                .toUpperCase()}
                        </span>

                    )}

                </div>


                <div className="profile-main-info">

                    <div className="profile-name-row">

                        <h1>
                            {name}
                        </h1>

                        {isAvailable && (

                            <span className="available-badge">
                                ● Available
                            </span>

                        )}

                    </div>


                    <p className="profile-specialization">

                        📷 {specialization}

                    </p>


                    <p className="profile-location">

                        📍 {location}

                    </p>


                    <div className="profile-stats">

                        <div>

                            <strong>
                                {experience}
                            </strong>

                            <span>
                                Years Experience
                            </span>

                        </div>


                        <div>

                            <strong>
                                ₹{price.toLocaleString("en-IN")}
                            </strong>

                            <span>
                                Starting Price
                            </span>

                        </div>


                        <div>

                            <strong>
                                {posts.length}
                            </strong>

                            <span>
                                Posts
                            </span>

                        </div>

                    </div>


                    <button
                        className="profile-book-button"
                        disabled={!isAvailable}
                        onClick={() => {

                            setBookingError("");
                            setBookingSuccess("");
                            setShowBooking(true);

                        }}
                    >

                        {isAvailable
                            ? "📅 Book Photographer"
                            : "Currently Unavailable"}

                    </button>

                </div>

            </section>


            {/* =========================================
                ERROR
            ========================================= */}

            {bookingError &&
                !showBooking && (

                    <div className="profile-page-error">

                        {bookingError}

                    </div>

                )}


            {/* =========================================
                PORTFOLIO
            ========================================= */}

            <section className="profile-portfolio">

                <div className="portfolio-heading">

                    <h2>
                        Portfolio
                    </h2>

                    <span>
                        {posts.length} posts
                    </span>

                </div>


                {posts.length === 0 ? (

                    <div className="empty-portfolio">

                        <div>
                            📷
                        </div>

                        <h3>
                            No portfolio posts yet
                        </h3>

                        <p>
                            This photographer hasn't
                            uploaded any photos yet.
                        </p>

                    </div>

                ) : (

                    <div className="portfolio-grid">

                        {posts.map((post) => (

                            <div
                                className="portfolio-item"
                                key={post._id}
                            >

                                <img
                                    src={post.imageUrl}
                                    alt={
                                        post.caption ||
                                        "Photography"
                                    }
                                />

                                <div className="portfolio-overlay">

                                    <span>
                                        ❤️{" "}
                                        {post.likes?.length || 0}
                                    </span>

                                    {post.caption && (

                                        <p>
                                            {post.caption}
                                        </p>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* =========================================
                BOOKING MODAL
            ========================================= */}

            {showBooking && (

                <div
                    className="booking-modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setShowBooking(false);
                        }

                    }}
                >

                    <div className="booking-modal">

                        <button
                            className="booking-close"
                            onClick={() =>
                                setShowBooking(false)
                            }
                        >
                            ×
                        </button>


                        <div className="booking-modal-header">

                            <div className="booking-modal-icon">
                                📅
                            </div>

                            <div>

                                <h2>
                                    Book {name}
                                </h2>

                                <p>
                                    Tell us about your event
                                </p>

                            </div>

                        </div>


                        {bookingError && (

                            <div className="booking-error">

                                {bookingError}

                            </div>

                        )}


                        {bookingSuccess && (

                            <div className="booking-success">

                                {bookingSuccess}

                            </div>

                        )}


                        <form
                            className="booking-form"
                            onSubmit={handleBooking}
                        >

                            {/* EVENT TYPE */}

                            <div className="booking-form-group">

                                <label>
                                    Event Type
                                </label>

                                <select
                                    name="eventType"
                                    value={
                                        form.eventType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="WEDDING">
                                        Wedding
                                    </option>

                                    <option value="CANDID">
                                        Candid Photography
                                    </option>

                                    <option value="PRE-WEDDING">
                                        Pre-Wedding
                                    </option>

                                    <option value="BIRTHDAY">
                                        Birthday
                                    </option>

                                    <option value="ENGAGEMENT">
                                        Engagement
                                    </option>

                                    <option value="CORPORATE">
                                        Corporate Event
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* DATE */}

                            <div className="booking-form-group">

                                <label>
                                    Event Date
                                </label>

                                <input
                                    type="date"
                                    name="eventDate"
                                    value={
                                        form.eventDate
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* LOCATION */}

                            <div className="booking-form-group">

                                <label>
                                    Event Location
                                </label>

                                <input
                                    type="text"
                                    name="eventLocation"
                                    placeholder="Example: Madurai, Tamil Nadu"
                                    value={
                                        form.eventLocation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* MESSAGE */}

                            <div className="booking-form-group">

                                <label>
                                    Message
                                    <span>
                                        {" "}
                                        (Optional)
                                    </span>
                                </label>

                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Tell the photographer about your event..."
                                    value={
                                        form.message
                                    }
                                    onChange={
                                        handleChange
                                    }
                                ></textarea>

                            </div>


                            {/* PRICE */}

                            <div className="booking-price-box">

                                <span>
                                    Photographer price
                                </span>

                                <strong>
                                    ₹
                                    {price.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                                <small>
                                    Final price can be
                                    discussed with the
                                    photographer.
                                </small>

                            </div>


                            {/* BUTTONS */}

                            <div className="booking-modal-actions">

                                <button
                                    type="button"
                                    className="booking-cancel-button"
                                    onClick={() =>
                                        setShowBooking(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="booking-confirm-button"
                                    disabled={
                                        bookingLoading
                                    }
                                >

                                    {bookingLoading
                                        ? "Sending..."
                                        : "Confirm Booking →"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default PhotographerProfile;