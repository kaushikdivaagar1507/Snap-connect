import { useEffect, useState } from "react";

import {
    createPost,
    getPhotographerBookings,
    getMyPhotographerProfile,
    acceptBooking,
    rejectBooking
} from "../api/api";

function PhotographerDashboard() {

    const [bookings, setBookings] = useState([]);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [postLoading, setPostLoading] =
        useState(false);

    const [postMessage, setPostMessage] =
        useState("");

    const [postError, setPostError] =
        useState("");

    const [postData, setPostData] = useState({
        imageUrl: "",
        caption: "",
        location: "",
        category: "WEDDING"
    });


    // ==================================================
    // LOAD DASHBOARD
    // ==================================================

    const loadDashboard = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const bookingData =
                await getPhotographerBookings(token);

            setBookings(
                bookingData.bookings || []
            );

            const profileData =
                await getMyPhotographerProfile(token);

            setProfile(
                profileData.profile
            );

        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadDashboard();

    }, []);


    // ==================================================
    // FORM CHANGE
    // ==================================================

    const handlePostChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setPostData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==================================================
    // CREATE POST
    // ==================================================

    const handleCreatePost = async (e) => {

        e.preventDefault();

        setPostMessage("");
        setPostError("");

        if (!postData.imageUrl.trim()) {

            setPostError(
                "Please enter the photo URL."
            );

            return;
        }

        try {

            setPostLoading(true);

            const token =
                localStorage.getItem("token");

            await createPost(
                token,
                postData
            );

            setPostMessage(
                "Your photo was posted successfully."
            );

            setPostData({
                imageUrl: "",
                caption: "",
                location: "",
                category: "WEDDING"
            });

        } catch (error) {

            console.error(
                "Create Post Error:",
                error
            );

            setPostError(
                error.message ||
                "Failed to create post."
            );

        } finally {

            setPostLoading(false);

        }

    };


    // ==================================================
    // BOOKING ACTION
    // ==================================================

    const handleBookingAction = async (
        bookingId,
        action
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            if (action === "accept") {

                await acceptBooking(
                    token,
                    bookingId
                );

            } else {

                await rejectBooking(
                    token,
                    bookingId
                );

            }

            loadDashboard();

        } catch (error) {

            console.error(
                "Booking Action Error:",
                error
            );

        }

    };


    // ==================================================
    // STATS
    // ==================================================

    const pendingCount =
        bookings.filter(
            (booking) =>
                booking.status === "PENDING"
        ).length;

    const confirmedCount =
        bookings.filter(
            (booking) =>
                booking.status === "CONFIRMED"
        ).length;

    const rejectedCount =
        bookings.filter(
            (booking) =>
                booking.status === "REJECTED"
        ).length;


    if (loading) {

        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );

    }


    return (

        <div className="photographer-dashboard">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-eyebrow">
                        PHOTOGRAPHER STUDIO
                    </p>

                    <h1>
                        Welcome back
                        {profile?.user?.name
                            ? `, ${profile.user.name}`
                            : ""}
                    </h1>

                    <p>
                        Manage your photography,
                        showcase your work and handle
                        client bookings.
                    </p>

                </div>

            </div>


            {/* ==========================================
                STATS
            ========================================== */}

            <div className="dashboard-stats">

                <div className="dashboard-stat-card">

                    <span className="stat-icon">
                        ◉
                    </span>

                    <div>
                        <strong>
                            {bookings.length}
                        </strong>

                        <span>
                            Total Bookings
                        </span>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <span className="stat-icon">
                        ◌
                    </span>

                    <div>
                        <strong>
                            {pendingCount}
                        </strong>

                        <span>
                            Pending
                        </span>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <span className="stat-icon">
                        ✓
                    </span>

                    <div>
                        <strong>
                            {confirmedCount}
                        </strong>

                        <span>
                            Confirmed
                        </span>
                    </div>

                </div>


                <div className="dashboard-stat-card">

                    <span className="stat-icon">
                        ×
                    </span>

                    <div>
                        <strong>
                            {rejectedCount}
                        </strong>

                        <span>
                            Rejected
                        </span>
                    </div>

                </div>

            </div>


            {/* ==========================================
                CREATE PHOTO POST
            ========================================== */}

            <section className="create-post-section">

                <div className="section-heading">

                    <div>

                        <span>
                            SHOWCASE YOUR WORK
                        </span>

                        <h2>
                            Create a new post
                        </h2>

                        <p>
                            Share your best photography
                            with clients on Explore.
                        </p>

                    </div>

                </div>


                <form
                    className="create-post-form"
                    onSubmit={handleCreatePost}
                >

                    <div className="post-form-left">

                        <div className="post-image-preview">

                            {postData.imageUrl ? (

                                <img
                                    src={
                                        postData.imageUrl
                                    }
                                    alt="Preview"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                            ) : (

                                <div className="post-preview-empty">

                                    <div>
                                        ✦
                                    </div>

                                    <p>
                                        Photo preview
                                    </p>

                                    <span>
                                        Add an image URL
                                        to preview it
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>


                    <div className="post-form-right">

                        <div className="form-group">

                            <label>
                                Photo URL
                            </label>

                            <input
                                type="url"
                                name="imageUrl"
                                placeholder="https://example.com/your-photo.jpg"
                                value={
                                    postData.imageUrl
                                }
                                onChange={
                                    handlePostChange
                                }
                            />

                            <small>
                                Use a direct image URL
                                for your photography.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Caption
                            </label>

                            <textarea
                                name="caption"
                                placeholder="Tell clients about this moment..."
                                value={
                                    postData.caption
                                }
                                onChange={
                                    handlePostChange
                                }
                                rows="4"
                            />

                        </div>


                        <div className="post-form-row">

                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Madurai"
                                    value={
                                        postData.location
                                    }
                                    onChange={
                                        handlePostChange
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        postData.category
                                    }
                                    onChange={
                                        handlePostChange
                                    }
                                >

                                    <option value="WEDDING">
                                        Wedding
                                    </option>

                                    <option value="CANDID">
                                        Candid
                                    </option>

                                    <option value="PRE-WEDDING">
                                        Pre-Wedding
                                    </option>

                                    <option value="PORTRAIT">
                                        Portrait
                                    </option>

                                    <option value="FASHION">
                                        Fashion
                                    </option>

                                    <option value="EVENT">
                                        Event
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        {postError && (

                            <div className="dashboard-error">
                                {postError}
                            </div>

                        )}


                        {postMessage && (

                            <div className="dashboard-success">
                                {postMessage}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="create-post-button"
                            disabled={postLoading}
                        >

                            {postLoading
                                ? "Publishing..."
                                : "Publish Photo"}

                            {!postLoading && (
                                <span>→</span>
                            )}

                        </button>

                    </div>

                </form>

            </section>


            {/* ==========================================
                BOOKINGS
            ========================================== */}

            <section className="dashboard-bookings-section">

                <div className="section-heading">

                    <div>

                        <span>
                            CLIENT REQUESTS
                        </span>

                        <h2>
                            Booking requests
                        </h2>

                    </div>

                </div>


                {bookings.length === 0 ? (

                    <div className="empty-dashboard">
                        No booking requests yet.
                    </div>

                ) : (

                    <div className="booking-list">

                        {bookings.map(
                            (booking) => (

                                <div
                                    className="dashboard-booking-card"
                                    key={
                                        booking._id
                                    }
                                >

                                    <div className="booking-client">

                                        <div className="booking-avatar">
                                            {booking.client?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "C"}
                                        </div>

                                        <div>

                                            <strong>
                                                {
                                                    booking
                                                        .client
                                                        ?.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    booking
                                                        .client
                                                        ?.email
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    <div className="booking-details">

                                        <span>
                                            EVENT
                                        </span>

                                        <strong>
                                            {
                                                booking.eventType
                                            }
                                        </strong>

                                    </div>


                                    <div className="booking-details">

                                        <span>
                                            DATE
                                        </span>

                                        <strong>
                                            {new Date(
                                                booking.eventDate
                                            ).toLocaleDateString()}
                                        </strong>

                                    </div>


                                    <div className="booking-details">

                                        <span>
                                            LOCATION
                                        </span>

                                        <strong>
                                            {
                                                booking.eventLocation
                                            }
                                        </strong>

                                    </div>


                                    <div className="booking-details">

                                        <span>
                                            PRICE
                                        </span>

                                        <strong>
                                            ₹
                                            {
                                                booking.price
                                            }
                                        </strong>

                                    </div>


                                    <div className="booking-actions">

                                        {booking.status ===
                                            "PENDING" ? (

                                            <>

                                                <button
                                                    className="accept-booking-button"
                                                    onClick={() =>
                                                        handleBookingAction(
                                                            booking._id,
                                                            "accept"
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    className="reject-booking-button"
                                                    onClick={() =>
                                                        handleBookingAction(
                                                            booking._id,
                                                            "reject"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </>

                                        ) : (

                                            <span
                                                className={`booking-status ${booking.status.toLowerCase()}`}
                                            >
                                                {
                                                    booking.status
                                                }
                                            </span>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );
}

export default PhotographerDashboard;