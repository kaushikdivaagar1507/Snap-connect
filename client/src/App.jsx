import {
    useEffect,
    useMemo,
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
import PhotographerMyProfile
    from "./pages/PhotographerMyProfile";
import {
    getAllPosts,
    getPhotographers,
    toggleLike,
    getComments,
    createComment
} from "./api/api";

import "./App.css";


function App() {

    /* =================================================
       AUTH
    ================================================= */

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


    /* =================================================
       PAGE STATES
    ================================================= */

    const [showMyBookings, setShowMyBookings] =
        useState(false);

    const [showDashboard, setShowDashboard] =
        useState(false);

    const [showEditProfile, setShowEditProfile] =
        useState(false);
    const [showMyProfile, setShowMyProfile] =
    useState(false);
    const [
        selectedPhotographer,
        setSelectedPhotographer
    ] = useState(null);


    /* =================================================
       DATA
    ================================================= */

    const [posts, setPosts] =
        useState([]);

    const [photographers, setPhotographers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =================================================
       EXPLORE POST
    ================================================= */

        const [selectedPost, setSelectedPost] =
            useState(null);
        const [selectedPostComments, setSelectedPostComments] =
            useState([]);

        const [commentText, setCommentText] =
            useState("");

        const [commentsLoading, setCommentsLoading] =
            useState(false);


    /* =================================================
       SEARCH + FILTER STATES
    ================================================= */

    const [searchText, setSearchText] =
        useState("");

    const [priceFilter, setPriceFilter] =
        useState("ALL");

    const [locationFilter, setLocationFilter] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("ALL");

    const [showFilters, setShowFilters] =
        useState(false);


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
        setShowMyProfile(false);
        setSelectedPhotographer(null);
        setSelectedPost(null);

    };


    /* =================================================
       OPEN EXPLORE POST
    ================================================= */

    const handleOpenPost = async (post) => {

    setSelectedPost(post);

    setSelectedPostComments([]);

    setCommentText("");

    try {

        setCommentsLoading(true);

        const token =
            localStorage.getItem("token");

        const data =
            await getComments(
                token,
                post._id
            );

        setSelectedPostComments(
            data.comments || []
        );

    } catch (error) {

        console.error(
            "Load Comments Error:",
            error
        );

    } finally {

        setCommentsLoading(false);

    }

};


    /* =================================================
       CLOSE EXPLORE POST
    ================================================= */

    const handleClosePost = () => {

    setSelectedPost(null);

    setSelectedPostComments([]);

    setCommentText("");

};
const handleAddExploreComment =
    async () => {

        if (
            !selectedPost ||
            !commentText.trim()
        ) {

            return;

        }


        try {

            const token =
                localStorage.getItem("token");


            const data =
                await createComment(
                    token,
                    selectedPost._id,
                    commentText.trim()
                );


            setSelectedPostComments(
                previous => [
                    ...previous,
                    data.comment
                ]
            );


            setCommentText("");


        } catch (error) {

            console.error(
                "Add Comment Error:",
                error
            );

        }

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


                /* -------------------------------------
                   GET ALL POSTS
                ------------------------------------- */

                const postsData =
                    await getAllPosts(token);


                /*
                   Sort latest → oldest

                   Newest post will appear first.
                */

                const sortedPosts =
                    [...(postsData.posts || [])]
                        .sort(
                            (a, b) =>
                                new Date(
                                    b.createdAt
                                ) -
                                new Date(
                                    a.createdAt
                                )
                        );


                setPosts(sortedPosts);


                /* -------------------------------------
                   GET PHOTOGRAPHERS
                ------------------------------------- */

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
       SEARCH + FILTER LOGIC
    ================================================= */

    const filteredPhotographers =
        useMemo(() => {

            let result =
                [...photographers];


            /* -----------------------------------------
               SEARCH BY NAME
            ----------------------------------------- */

            if (
                searchText.trim()
            ) {

                const search =
                    searchText
                        .trim()
                        .toLowerCase();


                result =
                    result.filter(
                        photographer => {

                            const name =
                                photographer.user?.name ||
                                photographer.name ||
                                "";


                            return name
                                .toLowerCase()
                                .includes(search);

                        }
                    );

            }


            /* -----------------------------------------
               LOCATION FILTER
            ----------------------------------------- */

            if (
                locationFilter.trim()
            ) {

                const location =
                    locationFilter
                        .trim()
                        .toLowerCase();


                result =
                    result.filter(
                        photographer => {

                            const photographerLocation =
                                photographer.location ||
                                "";


                            return photographerLocation
                                .toLowerCase()
                                .includes(
                                    location
                                );

                        }
                    );

            }


            /* -----------------------------------------
               PHOTOGRAPHER TYPE
            ----------------------------------------- */

            if (
                typeFilter !== "ALL"
            ) {

                result =
                    result.filter(
                        photographer => {

                            const specialization =
                                photographer.specialization ||
                                "";


                            return specialization
                                .toLowerCase()
                                .includes(
                                    typeFilter.toLowerCase()
                                );

                        }
                    );

            }


            /* -----------------------------------------
               PRICE FILTER
            ----------------------------------------- */

            if (
                priceFilter !== "ALL"
            ) {

                result =
                    result.filter(
                        photographer => {

                            const price =
                                Number(
                                    photographer.pricePerEvent ||
                                    0
                                );


                            if (
                                priceFilter ===
                                "UNDER_10000"
                            ) {

                                return price <
                                    10000;

                            }


                            if (
                                priceFilter ===
                                "10000_25000"
                            ) {

                                return (
                                    price >= 10000 &&
                                    price <= 25000
                                );

                            }


                            if (
                                priceFilter ===
                                "25000_50000"
                            ) {

                                return (
                                    price > 25000 &&
                                    price <= 50000
                                );

                            }


                            if (
                                priceFilter ===
                                "ABOVE_50000"
                            ) {

                                return price >
                                    50000;

                            }


                            return true;

                        }
                    );

            }


            return result;

        }, [

            photographers,

            searchText,

            priceFilter,

            locationFilter,

            typeFilter

        ]);


    /* =================================================
       CLEAR FILTERS
    ================================================= */

    const clearFilters = () => {

        setSearchText("");

        setPriceFilter("ALL");

        setLocationFilter("");

        setTypeFilter("ALL");

    };


    /* =================================================
       CHECK FILTER ACTIVE
    ================================================= */

    const filtersActive =
        searchText.trim() !== "" ||
        locationFilter.trim() !== "" ||
        priceFilter !== "ALL" ||
        typeFilter !== "ALL";


    /* =================================================
       LIKE POST
    ================================================= */

    const handleLike = async (
        postId
    ) => {

        try {

            const token =
                localStorage.getItem("token");


            const data =
                await toggleLike(
                    token,
                    postId
                );


            setPosts(
                previousPosts =>

                    previousPosts.map(
                        post => {

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

                        }
                    )

            );


            /*
               Also update the selected
               Explore post if it is open.
            */

            setSelectedPost(
                previousPost => {

                    if (
                        !previousPost ||
                        previousPost._id !== postId
                    ) {

                        return previousPost;

                    }


                    return {
                        ...previousPost,
                        likes:
                            data.likes ||
                            previousPost.likes
                    };

                }
            );


        } catch (error) {

            console.error(
                "Like Error:",
                error
            );

        }

    };


    /* =================================================
       VIEW PHOTOGRAPHER PROFILE
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

        setSelectedPost(null);


        setSelectedPhotographer(
            photographer
        );

    };


    /* =================================================
       BACK FROM PROFILE
    ================================================= */

    const handleBackFromProfile = () => {

        setSelectedPhotographer(
            null
        );

    };


    /* =================================================
       BACK FROM BOOKINGS
    ================================================= */

    const handleBackFromBookings = () => {

        setShowMyBookings(
            false
        );

    };


    /* =================================================
       BACK FROM DASHBOARD
    ================================================= */

    const handleBackFromDashboard = () => {

        setShowDashboard(
            false
        );

    };


    /* =================================================
       BACK FROM EDIT PROFILE
    ================================================= */

    const handleBackFromEditProfile = () => {

        setShowEditProfile(
            false
        );

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
       CLIENT PHOTOGRAPHER PROFILE
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
       CLIENT MY BOOKINGS
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
    /* =================================================
   PHOTOGRAPHER MY PROFILE
================================================= */

    if (
        role === "PHOTOGRAPHER" &&
        showMyProfile
    ) {

        return (

            <PhotographerMyProfile

                onBack={() =>
                    setShowMyProfile(false)
                }

            />

        );

    }

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


                    {/* CLIENT BOOKINGS */}

                    {role === "CLIENT" && (

                        <button
                            className="nav-button"

                            onClick={() => {

                                setSelectedPhotographer(
                                    null
                                );

                                setSelectedPost(
                                    null
                                );

                                setShowMyBookings(
                                    true
                                );

                            }}
                        >

                            My Bookings

                        </button>

                    )}


                   {role === "PHOTOGRAPHER" && (

                            <>

                                <button
                                    className="nav-button"

                                    onClick={() => {

                                        setShowMyProfile(true);

                                        setShowDashboard(false);

                                        setShowEditProfile(false);

                                    }}
                                >

                                    My Profile

                                </button>


                                <button
                                    className="nav-button"

                                    onClick={() => {

                                        setShowDashboard(true);

                                        setShowMyProfile(false);

                                        setShowEditProfile(false);

                                    }}
                                >

                                    Dashboard

                                </button>

                            </>

                        )}


                    {/* LOGOUT */}

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
                MAIN HOME
            ========================================= */}

            <main className="home-container">


                {/* =====================================
                    HERO
                ===================================== */}

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


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (

                    <div className="home-error">

                        {error}

                    </div>

                )}


                {/* =================================================
                    INSTAGRAM STYLE EXPLORE
                ================================================= */}

                {role === "CLIENT" && (

                    <section className="explore-section">


                        <div className="explore-header">

                            <div>

                                <span className="explore-eyebrow">
                                    DISCOVER PHOTOGRAPHERS
                                </span>

                                <h2>
                                    Explore
                                </h2>

                                <p>
                                    Discover the latest moments
                                    captured by photographers.
                                </p>

                            </div>

                        </div>


                        {loading ? (

                            <div className="explore-empty">

                                <div className="explore-empty-icon">
                                    ⏳
                                </div>

                                <h3>
                                    Loading photos...
                                </h3>

                                <p>
                                    Discovering the latest
                                    photographer moments.
                                </p>

                            </div>

                        ) : posts.length === 0 ? (

                            <div className="explore-empty">

                                <div className="explore-empty-icon">
                                    ✦
                                </div>

                                <h3>
                                    No photos yet
                                </h3>

                                <p>
                                    Photographers haven't shared
                                    their work yet.
                                </p>

                            </div>

                        ) : (

                            <div className="explore-grid">

                                {posts.map(
                                    post => (

                                        <button
                                            key={
                                                post._id
                                            }

                                            className="explore-grid-item"

                                            onClick={() =>
                                                handleOpenPost(
                                                    post
                                                )
                                            }
                                        >

                                            <img
                                                src={
                                                    post.imageUrl
                                                }

                                                alt={
                                                    post.caption ||
                                                    "Photography"
                                                }
                                            />


                                            <div className="explore-grid-overlay">

                                                <span>

                                                    ♥{" "}

                                                    {
                                                        post.likes?.length ||
                                                        0
                                                    }

                                                </span>


                                                <span>

                                                    {
                                                        post.category ||
                                                        "Photography"
                                                    }

                                                </span>

                                            </div>

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    EXPLORE PHOTO MODAL
                ================================================= */}

                {selectedPost && (

                    <div
                        className="explore-modal-backdrop"

                        onClick={
                            handleClosePost
                        }
                    >


                        <div
                            className="explore-modal"

                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* CLOSE */}

                            <button
                                className="explore-modal-close"

                                onClick={
                                    handleClosePost
                                }
                            >

                                ×

                            </button>


                            {/* =================================
                                IMAGE
                            ================================= */}

                            <div className="explore-modal-image">

                                <img
                                    src={
                                        selectedPost.imageUrl
                                    }

                                    alt={
                                        selectedPost.caption ||
                                        "Photography"
                                    }
                                />

                            </div>


                            {/* =================================
                                DETAILS
                            ================================= */}

                            <div className="explore-modal-details">


                                {/* ---------------------------------
                                    PHOTOGRAPHER
                                --------------------------------- */}

                                <div className="modal-photographer">


                                    <div className="modal-photographer-avatar">

                                        {selectedPost
                                            .photographer
                                            ?.profileImage ? (

                                            <img
                                                src={
                                                    selectedPost
                                                        .photographer
                                                        .profileImage
                                                }

                                                alt=""
                                            />

                                        ) : (

                                            <span>

                                                {
                                                    selectedPost
                                                        .photographer
                                                        ?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                    "P"
                                                }

                                            </span>

                                        )}

                                    </div>


                                    <div className="modal-photographer-info">

                                        <strong>

                                            {
                                                selectedPost
                                                    .photographer
                                                    ?.name ||
                                                "Photographer"
                                            }

                                        </strong>


                                        <span>

                                            {
                                                selectedPost
                                                    .photographerProfile
                                                    ?.specialization ||
                                                selectedPost.category ||
                                                "Photography"
                                            }

                                        </span>

                                    </div>


                                    {/* VIEW PROFILE */}

                                    <button
                                        className="modal-profile-button"

                                        onClick={() => {

                                            const photographer =
                                                photographers.find(
                                                    item =>
                                                        item.user?._id ===
                                                        selectedPost
                                                            .photographer
                                                            ?._id
                                                );


                                            if (
                                                photographer
                                            ) {

                                                handleClosePost();

                                                handleViewProfile(
                                                    photographer
                                                );

                                            }

                                        }}
                                    >

                                        View Profile

                                    </button>

                                </div>


                                {/* ---------------------------------
                                    CAPTION
                                --------------------------------- */}

                                {selectedPost.caption && (

                                    <div className="modal-caption">

                                        <strong>

                                            {
                                                selectedPost
                                                    .photographer
                                                    ?.name ||
                                                "Photographer"
                                            }

                                        </strong>

                                        {" "}

                                        {
                                            selectedPost.caption
                                        }

                                    </div>

                                )}


                                {/* ---------------------------------
                                    LOCATION
                                --------------------------------- */}

                                {selectedPost.location && (

                                    <div className="modal-location">

                                        <span>
                                            ◉
                                        </span>

                                        {
                                            selectedPost.location
                                        }

                                    </div>

                                )}


                                {/* ---------------------------------
                                    CATEGORY
                                --------------------------------- */}

                                <div className="modal-category">

                                    #
                                    {
                                        selectedPost.category ||
                                        "Photography"
                                    }

                                </div>


                                {/* ---------------------------------
                                    LIKES
                                --------------------------------- */}

                               {/* ---------------------------------
    LIKE BUTTON
--------------------------------- */}

                                <div className="modal-like-section">

                                    <button
                                        type="button"
                                        className={`modal-like-button ${
                                            selectedPost.likedByMe
                                                ? "liked"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleLike(
                                                selectedPost._id
                                            )
                                        }
                                    >

                                        <span className="modal-heart">

                                            {selectedPost.likedByMe
                                                ? "♥"
                                                : "♡"}

                                        </span>

                                        <span>

                                            {selectedPost.likes?.length || 0}

                                        </span>

                                    </button>


                                    <span className="modal-like-text">

                                        {selectedPost.likes?.length === 1
                                            ? "like"
                                            : "likes"}

                                    </span>

                                </div>

                                {/* =================================
                                    COMMENTS
                                ================================= */}

                                <div className="explore-comments-section">

                                    <div className="explore-comments-title">

                                        💬 Comments

                                        <span>
                                            {selectedPostComments.length}
                                        </span>

                                    </div>


                                    <div className="explore-comments-list">

                                        {commentsLoading ? (

                                            <p className="comments-loading">
                                                Loading comments...
                                            </p>

                                        ) : selectedPostComments.length === 0 ? (

                                            <p className="no-comments">
                                                No comments yet. Be the first to comment.
                                            </p>

                                        ) : (

                                            selectedPostComments.map(
                                                comment => (

                                                    <div
                                                        className="explore-comment-item"
                                                        key={
                                                            comment._id
                                                        }
                                                    >

                                                        <strong>

                                                            {
                                                                comment
                                                                    .user
                                                                    ?.name ||
                                                                "User"
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                comment.text
                                                            }

                                                        </span>

                                                    </div>

                                                )
                                            )

                                        )}

                                    </div>


                                    <div className="explore-comment-input">

                                        <input
                                            type="text"

                                            placeholder="Add a comment..."

                                            value={
                                                commentText
                                            }

                                            onChange={(e) =>
                                                setCommentText(
                                                    e.target.value
                                                )
                                            }

                                            onKeyDown={(e) => {

                                                if (
                                                    e.key ===
                                                    "Enter"
                                                ) {

                                                    e.preventDefault();

                                                    handleAddExploreComment();

                                                }

                                            }}
                                        />


                                        <button
                                            onClick={
                                                handleAddExploreComment
                                            }
                                        >

                                            Post

                                        </button>

                                    </div>

                                </div>


                                {/* ---------------------------------
                                    BOOK BUTTON
                                --------------------------------- */}

                                <button
                                    className="modal-book-button"

                                    onClick={() => {

                                        const photographer =
                                            photographers.find(
                                                item =>
                                                    item.user?._id ===
                                                    selectedPost
                                                        .photographer
                                                        ?._id
                                            );


                                        if (
                                            photographer
                                        ) {

                                            handleClosePost();

                                            handleViewProfile(
                                                photographer
                                            );

                                        }

                                    }}
                                >

                                    View Photographer & Book

                                    <span>
                                        →
                                    </span>

                                </button>


                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    CLIENT PHOTOGRAPHER SEARCH
                ================================================= */}

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


                        {/* =================================
                            SEARCH BAR
                        ================================= */}

                        <div className="photographer-search-area">


                            <div className="search-bar-wrapper">

                                <span className="search-icon">
                                    🔍
                                </span>


                                <input
                                    type="text"

                                    placeholder="Search photographer by name..."

                                    value={
                                        searchText
                                    }

                                    onChange={(e) =>
                                        setSearchText(
                                            e.target.value
                                        )
                                    }
                                />


                                {searchText && (

                                    <button
                                        className="search-clear-button"

                                        onClick={() =>
                                            setSearchText("")
                                        }
                                    >

                                        ×

                                    </button>

                                )}

                            </div>


                            <button
                                className={`filter-toggle-button ${
                                    showFilters
                                        ? "active"
                                        : ""
                                }`}

                                onClick={() =>
                                    setShowFilters(
                                        !showFilters
                                    )
                                }
                            >

                                ⚙ Filters


                                {filtersActive && (

                                    <span className="filter-count">

                                        !

                                    </span>

                                )}

                            </button>

                        </div>


                        {/* =================================
                            FILTER PANEL
                        ================================= */}

                        {showFilters && (

                            <div className="photographer-filter-panel">


                                {/* PRICE */}

                                <div className="filter-group">

                                    <label>
                                        Price
                                    </label>


                                    <select
                                        value={
                                            priceFilter
                                        }

                                        onChange={(e) =>
                                            setPriceFilter(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Prices
                                        </option>

                                        <option value="UNDER_10000">
                                            Under ₹10,000
                                        </option>

                                        <option value="10000_25000">
                                            ₹10,000 - ₹25,000
                                        </option>

                                        <option value="25000_50000">
                                            ₹25,000 - ₹50,000
                                        </option>

                                        <option value="ABOVE_50000">
                                            Above ₹50,000
                                        </option>

                                    </select>

                                </div>


                                {/* LOCATION */}

                                <div className="filter-group">

                                    <label>
                                        Location
                                    </label>


                                    <input
                                        type="text"

                                        placeholder="Example: Madurai"

                                        value={
                                            locationFilter
                                        }

                                        onChange={(e) =>
                                            setLocationFilter(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* TYPE */}

                                <div className="filter-group">

                                    <label>
                                        Photographer Type
                                    </label>


                                    <select
                                        value={
                                            typeFilter
                                        }

                                        onChange={(e) =>
                                            setTypeFilter(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Types
                                        </option>

                                        <option value="Wedding">
                                            Wedding
                                        </option>

                                        <option value="Candid">
                                            Candid
                                        </option>

                                        <option value="Pre-Wedding">
                                            Pre-Wedding
                                        </option>

                                        <option value="Birthday">
                                            Birthday
                                        </option>

                                        <option value="Engagement">
                                            Engagement
                                        </option>

                                        <option value="Corporate">
                                            Corporate
                                        </option>

                                    </select>

                                </div>


                                {/* CLEAR */}

                                {filtersActive && (

                                    <button
                                        className="clear-filters-button"

                                        onClick={
                                            clearFilters
                                        }
                                    >

                                        Clear Filters

                                    </button>

                                )}

                            </div>

                        )}


                        {/* =================================
                            RESULT COUNT
                        ================================= */}

                        {!loading && (

                            <div className="photographer-result-info">

                                <span>

                                    {
                                        filteredPhotographers.length
                                    }{" "}

                                    {
                                        filteredPhotographers.length === 1
                                            ? "photographer"
                                            : "photographers"
                                    }{" "}

                                    found

                                </span>


                                {filtersActive && (

                                    <span className="filtered-label">

                                        Filters applied

                                    </span>

                                )}

                            </div>

                        )}


                        {/* =================================
                            PHOTOGRAPHER RESULTS
                        ================================= */}

                        {loading ? (

                            <div className="home-loading">

                                <div className="loading-spinner"></div>

                                <p>
                                    Finding photographers...
                                </p>

                            </div>

                        ) : filteredPhotographers.length === 0 ? (

                            <div className="home-empty">

                                <div>
                                    🔍
                                </div>


                                <h3>
                                    No photographers found
                                </h3>


                                <p>
                                    Try changing your
                                    search or filters.
                                </p>


                                {filtersActive && (

                                    <button
                                        className="empty-clear-button"

                                        onClick={
                                            clearFilters
                                        }
                                    >

                                        Clear Search & Filters

                                    </button>

                                )}

                            </div>

                        ) : (

                            <div className="photographer-grid">

                                {filteredPhotographers.map(
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


                                                {/* IMAGE */}

                                                <div className="photographer-card-image">

                                                    {image ? (

                                                        <img
                                                            src={
                                                                image
                                                            }

                                                            alt={
                                                                name
                                                            }
                                                        />

                                                    ) : (

                                                        <div className="photographer-card-placeholder">

                                                            {
                                                                name
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                            }

                                                        </div>

                                                    )}


                                                    {photographer.isAvailable && (

                                                        <span className="available-pill">

                                                            ● Available

                                                        </span>

                                                    )}

                                                </div>


                                                {/* CONTENT */}

                                                <div className="photographer-card-content">


                                                    <h3>
                                                        {name}
                                                    </h3>


                                                    <p className="card-specialization">

                                                        📷{" "}

                                                        {
                                                            photographer.specialization ||
                                                            "Photography"
                                                        }

                                                    </p>


                                                    <p className="card-location">

                                                        📍{" "}

                                                        {
                                                            photographer.location ||
                                                            "Location not specified"
                                                        }

                                                    </p>


                                                    <div className="card-bottom">


                                                        <div>

                                                            <span>
                                                                From
                                                            </span>


                                                            <strong>

                                                                ₹
                                                                {
                                                                    (
                                                                        photographer.pricePerEvent ||
                                                                        0
                                                                    ).toLocaleString(
                                                                        "en-IN"
                                                                    )
                                                                }

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


                {/* =================================================
                    LATEST MOMENTS
                ================================================= */}

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

                            {posts.map(
                                post => (

                                    <div
                                        className="moment-card"

                                        key={
                                            post._id
                                        }
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

                                                {
                                                    post.caption ||
                                                    "Beautiful moment"
                                                }

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

                                                    {
                                                        post.likes?.length ||
                                                        0
                                                    }

                                                </button>


                                                <span>

                                                    📍{" "}

                                                    {
                                                        post.location ||
                                                        "India"
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


            </main>

        </div>

    );

}


export default App;