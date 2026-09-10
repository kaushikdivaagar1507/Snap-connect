import {
    useEffect,
    useState
} from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import PhotographerProfile
    from "./pages/PhotographerProfile";

import MyBookings
    from "./pages/MyBookings";

import PhotographerDashboard
    from "./pages/PhotographerDashboard";

import EditPhotographerProfile
    from "./pages/EditPhotographerProfile";


import {
    getAllPosts,
    getPhotographers,
    toggleLike,
    getComments,
    createComment
} from "./api/api";


import "./App.css";


function App() {

    const [isLoggedIn, setIsLoggedIn] =
        useState(
            !!localStorage.getItem("token")
        );


    const [role, setRole] =
        useState(
            localStorage.getItem("role")
        );


    const [showSignup, setShowSignup] =
        useState(false);


    const [showMyBookings, setShowMyBookings] =
        useState(false);


    const [showDashboard, setShowDashboard] =
        useState(false);


    const [showEditProfile, setShowEditProfile] =
        useState(false);


    const [
        selectedPhotographer,
        setSelectedPhotographer
    ] = useState(null);


    const [posts, setPosts] =
        useState([]);


    const [photographers, setPhotographers] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    /* =================================================
       LOGIN
    ================================================= */

    const handleLogin = () => {

        setRole(
            localStorage.getItem("role")
        );

        setIsLoggedIn(true);

        setShowSignup(false);

    };


    /* =================================================
       LOGOUT
    ================================================= */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setIsLoggedIn(false);
        setRole(null);

        setShowMyBookings(false);
        setShowDashboard(false);
        setShowEditProfile(false);
        setSelectedPhotographer(null);

    };


    /* =================================================
       HOME DATA
    ================================================= */

    useEffect(() => {

        if (!isLoggedIn) {

            setLoading(false);

            return;

        }


        const fetchData = async () => {

            try {

                setLoading(true);
                setError("");


                const token =
                    localStorage.getItem("token");


                if (!token) {

                    setLoading(false);

                    return;

                }


                const postsData =
                    await getAllPosts(token);


                setPosts(
                    postsData.posts || []
                );


                if (role === "CLIENT") {

                    const photographersData =
                        await getPhotographers(
                            token
                        );


                    setPhotographers(
                        photographersData.photographers ||
                        []
                    );

                } else {

                    setPhotographers([]);

                }

            } catch (err) {

                console.error(
                    "Home Data Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load home data"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [isLoggedIn, role]);


    /* =================================================
       LIKE POST
    ================================================= */

    const handleLike = async (postId) => {

        try {

            const token =
                localStorage.getItem("token");


            const data =
                await toggleLike(
                    token,
                    postId
                );


            setPosts(prevPosts =>

                prevPosts.map(post => {

                    if (
                        post._id ===
                        postId
                    ) {

                        return {
                            ...post,
                            likes:
                                data.likes ||
                                post.likes
                        };

                    }

                    return post;

                })

            );

        } catch (error) {

            console.error(
                "Like Error:",
                error
            );

        }

    };


    /* =================================================
       VIEW PROFILE
    ================================================= */

    const handleViewProfile = (
        photographer
    ) => {

        console.log(
            "👤 Opening Photographer Profile:",
            photographer
        );


        setShowMyBookings(false);
        setShowDashboard(false);
        setShowEditProfile(false);


        setSelectedPhotographer(
            photographer
        );

    };


    /* =================================================
       BACK FROM PROFILE
    ================================================= */

    const handleBackFromProfile = () => {

        setSelectedPhotographer(null);

    };


    /* =================================================
       BACK FROM BOOKINGS
    ================================================= */

    const handleBackFromBookings = () => {

        setShowMyBookings(false);

    };


    /* =================================================
       BACK FROM DASHBOARD
    ================================================= */

    const handleBackFromDashboard = () => {

        setShowDashboard(false);

    };


    /* =================================================
       BACK FROM EDIT PROFILE
    ================================================= */

    const handleBackFromEditProfile = () => {

        setShowEditProfile(false);

    };


    /* =================================================
       AUTH SCREEN
    ================================================= */

    if (!isLoggedIn) {

        if (showSignup) {

            return (

                <Signup
                    onSignup={() =>
                        setShowSignup(false)
                    }
                    onBackToLogin={() =>
                        setShowSignup(false)
                    }
                />

            );

        }


        return (

            <Login
                onLogin={
                    handleLogin
                }
                onSignup={() =>
                    setShowSignup(true)
                }
            />

        );

    }


    /* =================================================
       PHOTOGRAPHER PROFILE
    ================================================= */

    if (
        role === "CLIENT" &&
        selectedPhotographer
    ) {

        return (

            <PhotographerProfile
                photographer={
                    selectedPhotographer
                }
                onBack={
                    handleBackFromProfile
                }
            />

        );

    }


    /* =================================================
       CLIENT BOOKINGS
    ================================================= */

    if (
        role === "CLIENT" &&
        showMyBookings
    ) {

        return (

            <MyBookings
                onBack={
                    handleBackFromBookings
                }
            />

        );

    }


    /* =================================================
       PHOTOGRAPHER DASHBOARD
    ================================================= */

    if (
        role === "PHOTOGRAPHER" &&
        showDashboard
    ) {

        return (

            <PhotographerDashboard
                onBack={
                    handleBackFromDashboard
                }
            />

        );

    }


    /* =================================================
       PHOTOGRAPHER EDIT PROFILE
    ================================================= */

    if (
        role === "PHOTOGRAPHER" &&
        showEditProfile
    ) {

        return (

            <EditPhotographerProfile
                onBack={
                    handleBackFromEditProfile
                }
            />

        );

    }


    /* =================================================
       MAIN HOME
    ================================================= */

    return (

        <div className="app">

            {/* =========================================
                NAVBAR
            ========================================= */}

            <nav className="main-navbar">

                <div className="navbar-logo">

                    <span className="navbar-logo-icon">
                        ✦
                    </span>

                    <span>
                        SnapBook
                    </span>

                </div>


                <div className="navbar-actions">

                    {role === "CLIENT" && (

                        <button
                            className="nav-button"
                            onClick={() => {

                                setSelectedPhotographer(
                                    null
                                );

                                setShowMyBookings(
                                    true
                                );

                            }}
                        >
                            📅 My Bookings
                        </button>

                    )}


                    {role ===
                        "PHOTOGRAPHER" && (

                        <>

                            <button
                                className="nav-button"
                                onClick={() => {

                                    setShowEditProfile(
                                        false
                                    );

                                    setShowDashboard(
                                        true
                                    );

                                }}
                            >
                                📋 Dashboard
                            </button>


                            <button
                                className="nav-button"
                                onClick={() => {

                                    setShowDashboard(
                                        false
                                    );

                                    setShowEditProfile(
                                        true
                                    );

                                }}
                            >
                                ⚙ Edit Profile
                            </button>

                        </>

                    )}


                    <button
                        className="logout-button"
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* =========================================
                MAIN
            ========================================= */}

            <main className="home-container">

                {/* HERO */}

                <section className="home-hero">

                    <div>

                        <span className="hero-label">
                            CAPTURE • CONNECT • CREATE
                        </span>

                        <h1>
                            Find the perfect
                            <br />
                            photographer.
                        </h1>

                        <p>
                            Discover talented photographers
                            and turn your special moments
                            into unforgettable memories.
                        </p>

                    </div>

                </section>


                {error && (

                    <div className="home-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    PHOTOGRAPHERS
                ===================================== */}

                {role === "CLIENT" && (

                    <section className="photographers-section">

                        <div className="home-section-header">

                            <div>

                                <span>
                                    DISCOVER
                                </span>

                                <h2>
                                    Photographers
                                </h2>

                            </div>

                            <p>
                                Find someone who can
                                capture your story.
                            </p>

                        </div>


                        {loading ? (

                            <div className="home-loading">

                                <div className="loading-spinner"></div>

                                <p>
                                    Finding photographers...
                                </p>

                            </div>

                        ) : photographers.length === 0 ? (

                            <div className="home-empty">

                                <div>
                                    📷
                                </div>

                                <h3>
                                    No photographers found
                                </h3>

                                <p>
                                    Photographers will appear
                                    here once they create
                                    their profiles.
                                </p>

                            </div>

                        ) : (

                            <div className="photographer-grid">

                                {photographers.map(
                                    photographer => {

                                        const user =
                                            photographer.user ||
                                            {};

                                        const name =
                                            user.name ||
                                            "Photographer";

                                        const image =
                                            photographer.profileImage ||
                                            user.profileImage ||
                                            "";

                                        return (

                                            <div
                                                className="photographer-card"
                                                key={
                                                    photographer._id
                                                }
                                            >

                                                <div className="photographer-card-image">

                                                    {image ? (

                                                        <img
                                                            src={image}
                                                            alt={name}
                                                        />

                                                    ) : (

                                                        <div className="photographer-card-placeholder">

                                                            {name
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>

                                                    )}

                                                    {photographer.isAvailable && (

                                                        <span className="available-pill">
                                                            ● Available
                                                        </span>

                                                    )}

                                                </div>


                                                <div className="photographer-card-content">

                                                    <h3>
                                                        {name}
                                                    </h3>


                                                    <p className="card-specialization">

                                                        📷{" "}
                                                        {photographer.specialization ||
                                                            "Photography"}

                                                    </p>


                                                    <p className="card-location">

                                                        📍{" "}
                                                        {photographer.location ||
                                                            "Location not specified"}

                                                    </p>


                                                    <div className="card-bottom">

                                                        <div>

                                                            <span>
                                                                From
                                                            </span>

                                                            <strong>
                                                                ₹
                                                                {(
                                                                    photographer.pricePerEvent ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>

                                                        </div>


                                                        <button
                                                            className="view-profile-button"
                                                            onClick={() =>
                                                                handleViewProfile(
                                                                    photographer
                                                                )
                                                            }
                                                        >
                                                            View Profile →
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>

                )}


                {/* =====================================
                    LATEST MOMENTS
                ===================================== */}

                <section className="moments-section">

                    <div className="home-section-header">

                        <div>

                            <span>
                                COMMUNITY
                            </span>

                            <h2>
                                Latest Moments
                            </h2>

                        </div>

                        <p>
                            Stories captured by
                            our photographers.
                        </p>

                    </div>


                    {loading ? (

                        <div className="home-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading moments...
                            </p>

                        </div>

                    ) : posts.length === 0 ? (

                        <div className="home-empty">

                            <div>
                                📸
                            </div>

                            <h3>
                                No moments yet
                            </h3>

                            <p>
                                Beautiful photographs
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="moments-grid">

                            {posts.map(post => (

                                <div
                                    className="moment-card"
                                    key={post._id}
                                >

                                    <div className="moment-image">

                                        <img
                                            src={
                                                post.imageUrl
                                            }
                                            alt={
                                                post.caption ||
                                                "Photography"
                                            }
                                        />

                                    </div>


                                    <div className="moment-content">

                                        <p>
                                            {post.caption ||
                                                "Beautiful moment"}
                                        </p>


                                        <div className="moment-footer">

                                            <button
                                                onClick={() =>
                                                    handleLike(
                                                        post._id
                                                    )
                                                }
                                            >

                                                ❤️{" "}
                                                {post.likes?.length ||
                                                    0}

                                            </button>


                                            <span>
                                                📍{" "}
                                                {post.location ||
                                                    "India"}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

}


export default App;