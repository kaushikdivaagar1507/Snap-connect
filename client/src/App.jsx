import { useEffect, useState } from "react";
import "./App.css";
import MyBookings from "./pages/MyBookings";
import {
    getAllPosts,
    toggleLike,
    getComments,
    createComment,
    getPhotographers
} from "./api/api";
import EditPhotographerProfile from "./pages/EditPhotographerProfile";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import PhotographerProfile from "./pages/PhotographerProfile";
import PhotographerDashboard from "./pages/PhotographerDashboard";

function App() {

    // ==========================================
    // LOGIN STATE
    // ==========================================

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    // ==========================================
    // POSTS & NAVIGATION STATE
    // ==========================================
    const [showMyBookings, setShowMyBookings] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showExplore, setShowExplore] = useState(false);

    // ==========================================
    // COMMENTS STATE
    // ==========================================

    const [comments, setComments] = useState({});
    const [commentText, setCommentText] = useState({});

    // ==========================================
    // PHOTOGRAPHER STATE
    // ==========================================

    const [selectedPhotographer, setSelectedPhotographer] = useState(null);
    const [photographers, setPhotographers] = useState([]);
    const [showDashboard, setShowDashboard] = useState(false);

    // Reset all views back to Home Feed
    const resetViews = () => {
        setShowExplore(false);
        setShowMyBookings(false);
        setShowDashboard(false);
        setShowEditProfile(false);
        setSelectedPhotographer(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        resetViews();
    };

    // ==========================================
    // FETCH POSTS + PHOTOGRAPHERS
    // ==========================================

    useEffect(() => {

        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const postsData = await getAllPosts(token);
                setPosts(postsData.posts || []);

                if (role === "CLIENT") {
                    const photographersData = await getPhotographers(token);
                    setPhotographers(photographersData.photographers || []);
                } else {
                    setPhotographers([]);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch feed content.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [isLoggedIn, role]);


    // ==========================================
    // LOGIN PAGE ROUTE
    // ==========================================

    if (!isLoggedIn) {
        return (
            <Login
                onLogin={() => {
                    setRole(localStorage.getItem("role"));
                    setIsLoggedIn(true);
                }}
            />
        );
    }

    // ==========================================
    // PAGE ROUTING INTERCEPTORS
    // ==========================================

    if (showEditProfile) {
        return <EditPhotographerProfile onBack={() => setShowEditProfile(false)} />;
    }

    if (showDashboard) {
        return <PhotographerDashboard onBack={() => setShowDashboard(false)} />;
    }

    if (showMyBookings) {
            return (
                <div className="app">
                    <header className="navbar">
                        <div className="logo" onClick={resetViews} style={{ cursor: "pointer" }}>
                            Snap<span>Connect</span>
                        </div>
                        <div className="nav-icons">
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </header>
                    <div className="main-container full-width">
                        <MyBookings onBack={() => setShowMyBookings(false)} />
                    </div>
                </div>
            );
        }

    if (selectedPhotographer) {
        return (
            <div className="app">
                <div className="main-container full-width">
                    <PhotographerProfile
                        photographerId={selectedPhotographer}
                        onBack={() => setSelectedPhotographer(null)}
                    />
                </div>
            </div>
        );
    }

    if (showExplore) {
        return (
            <div className="app">
                <div className="main-container full-width">
                    <Explore onBack={() => setShowExplore(false)} />
                </div>
            </div>
        );
    }

    // ==========================================
    // LIKE / UNLIKE
    // ==========================================

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const data = await toggleLike(token, postId);

            setPosts((currentPosts) =>
                currentPosts.map((post) => {
                    if (post._id !== postId) return post;
                    
                    const likesArray = post.likes || [];
                    const hasLiked = data.liked;

                    return {
                        ...post,
                        likes: hasLiked
                            ? [...likesArray, "currentUser"]
                            : likesArray.filter((user) => user !== "currentUser")
                    };
                })
            );
        } catch (err) {
            console.error("Like Error:", err);
        }
    };

    // ==========================================
    // GET COMMENTS
    // ==========================================

    const handleGetComments = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const data = await getComments(token, postId);

            setComments((prev) => ({
                ...prev,
                [postId]: data.comments
            }));
        } catch (err) {
            console.error("Comments Error:", err);
        }
    };

    // ==========================================
    // CREATE COMMENT
    // ==========================================

    const handleComment = async (postId) => {
        try {
            const token = localStorage.getItem("token");
            const text = commentText[postId]?.trim();

            if (!text) return;

            const data = await createComment(token, postId, text);

            setComments((prev) => ({
                ...prev,
                [postId]: [data.comment, ...(prev[postId] || [])]
            }));

            setCommentText((prev) => ({
                ...prev,
                [postId]: ""
            }));
        } catch (err) {
            console.error("Create Comment Error:", err);
        }
    };

    // ==========================================
    // OPEN PHOTOGRAPHER PROFILE
    // ==========================================

    const openPhotographerProfile = (userId) => {
        const profile = photographers.find((p) => p.user?._id === userId);

        if (profile) {
            setSelectedPhotographer(profile._id);
        } else {
            console.error("Photographer profile not found");
        }
    };

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="app">

            {/* NAVBAR */}
            <header className="navbar">
                <div className="logo" onClick={resetViews} style={{ cursor: "pointer" }}>
                    Snap<span>Connect</span>
                </div>

                <div className="search-box">
                    🔍
                    <input
                        type="text"
                        placeholder="Search photographers..."
                    />
                </div>

                <div className="nav-icons">
                    <div className="top-navigation">
                        {role === "CLIENT" && (
                            <button onClick={() => setShowMyBookings(true)}>
                                📅 My Bookings
                            </button>
                        )}

                        {role === "PHOTOGRAPHER" && (
                            <button onClick={() => setShowDashboard(true)}>
                                📷 Photographer Dashboard
                            </button>
                        )}
                        {role === "PHOTOGRAPHER" && (
                            <button
                                className="dashboard-button"
                                onClick={() => setShowEditProfile(true)}
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    <button onClick={resetViews}>⌂</button>
                    <button>♡</button>
                    <button>✉</button>
                    <button>◯</button>
                </div>
            </header>

            {/* MAIN CONTAINER */}
            <div className="main-container">

                {/* LEFT SIDEBAR */}
                <aside className="sidebar">
                    <button 
                        className={`sidebar-item ${!showExplore ? "active" : ""}`} 
                        onClick={resetViews}
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button 
                        className={`sidebar-item ${showExplore ? "active" : ""}`}
                        onClick={() => setShowExplore(true)}
                    >
                        <span>⌕</span>
                        Explore
                    </button>

                    <button className="sidebar-item">
                        <span>＋</span>
                        Create
                    </button>

                    <button className="sidebar-item">
                        <span>♡</span>
                        Activity
                    </button>

                    <button className="sidebar-item">
                        <span>◯</span>
                        Profile
                    </button>

                    <div className="sidebar-bottom">
                        <button className="sidebar-item">
                            <span>☰</span>
                            More
                        </button>
                    </div>
                </aside>

                {/* FEED */}
                <main className="feed">
                    
                    {/* STORIES */}
                    <section className="stories">
                        <div className="story">
                            <div className="story-image">A</div>
                            <p>Arun</p>
                        </div>
                        <div className="story">
                            <div className="story-image">K</div>
                            <p>Kaushik</p>
                        </div>
                        <div className="story">
                            <div className="story-image">P</div>
                            <p>Priya</p>
                        </div>
                        <div className="story">
                            <div className="story-image">R</div>
                            <p>Rahul</p>
                        </div>
                        <div className="story">
                            <div className="story-image">S</div>
                            <p>Sanjay</p>
                        </div>
                    </section>

                    {/* LOADING */}
                    {loading && <div className="loading">Loading posts...</div>}

                    {/* ERROR */}
                    {error && <div className="error">{error}</div>}

                    {/* POSTS */}
                    {!loading && !error && (
                        <section className="posts">
                            {posts.length === 0 ? (
                                <div className="no-posts">No posts available</div>
                            ) : (
                                posts.map((post) => (
                                    <article className="post" key={post._id}>
                                        
                                        {/* POST HEADER */}
                                        <div className="post-header">
                                            <div className="user-avatar">
                                                {post.photographer?.name
                                                    ? post.photographer.name.charAt(0).toUpperCase()
                                                    : "U"}
                                            </div>

                                            <div className="post-user-info">
                                                <strong
                                                    className="clickable-photographer"
                                                    onClick={() => openPhotographerProfile(post.photographer?._id)}
                                                >
                                                    {post.photographer?.name || "Unknown Photographer"}
                                                </strong>
                                                <span>{post.location || "Location not available"}</span>
                                            </div>

                                            <button className="more-button">•••</button>
                                        </div>

                                        {/* POST IMAGE */}
                                        <div className="post-image">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.caption || "Photographer post"}
                                            />
                                        </div>

                                        {/* POST ACTIONS */}
                                        <div className="post-actions">
                                            <div>
                                                <button
                                                    onClick={() => handleLike(post._id)}
                                                    className="like-button"
                                                >
                                                    ♡
                                                </button>
                                                <button onClick={() => handleGetComments(post._id)}>
                                                    💬
                                                </button>
                                                <button>↗</button>
                                            </div>
                                            <button>🔖</button>
                                        </div>

                                        {/* LIKES */}
                                        <div className="likes">
                                            {post.likes?.length || 0} likes
                                        </div>

                                        {/* CAPTION */}
                                        <div className="caption">
                                            <strong
                                                className="clickable-photographer"
                                                onClick={() => openPhotographerProfile(post.photographer?._id)}
                                            >
                                                {post.photographer?.name || "Unknown"}
                                            </strong>
                                            {" "}
                                            {post.caption || ""}
                                        </div>

                                        {/* VIEW COMMENTS */}
                                        <button
                                            className="view-comments"
                                            onClick={() => handleGetComments(post._id)}
                                        >
                                            View all comments
                                        </button>

                                        {/* COMMENTS LIST */}
                                        {comments[post._id]?.map((comment) => (
                                            <div className="comment" key={comment._id}>
                                                <strong>{comment.user?.name || "User"}</strong>
                                                {" "}
                                                <span>{comment.text}</span>
                                            </div>
                                        ))}

                                        {/* COMMENT INPUT */}
                                        <div className="comment-box">
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={commentText[post._id] || ""}
                                                onChange={(e) =>
                                                    setCommentText((prev) => ({
                                                        ...prev,
                                                        [post._id]: e.target.value
                                                    }))
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleComment(post._id);
                                                    }
                                                }}
                                            />
                                            <button onClick={() => handleComment(post._id)}>
                                                Post
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </section>
                    )}
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="right-sidebar">
                    <div className="profile-preview">
                        <div className="large-avatar">K</div>
                        <div>
                            <strong>Kaushik</strong>
                            <span>Photographer</span>
                        </div>
                        <button>Switch</button>
                    </div>

                    <div className="suggestion-header">
                        <span>Suggested photographers</span>
                        <button>See All</button>
                    </div>

                    <div className="suggestion">
                        <div className="suggestion-avatar">A</div>
                        <div>
                            <strong>Arun</strong>
                            <span>Wedding Photographer</span>
                        </div>
                        <button>Follow</button>
                    </div>

                    <div className="suggestion">
                        <div className="suggestion-avatar">P</div>
                        <div>
                            <strong>Priya</strong>
                            <span>Candid Photographer</span>
                        </div>
                        <button>Follow</button>
                    </div>

                    <div className="suggestion">
                        <div className="suggestion-avatar">R</div>
                        <div>
                            <strong>Rahul</strong>
                            <span>Event Photographer</span>
                        </div>
                        <button>Follow</button>
                    </div>
                </aside>

            </div>
        </div>
    );
}

export default App;