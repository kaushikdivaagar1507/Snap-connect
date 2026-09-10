import {
    useEffect,
    useState
} from "react";

import {
    getMyPhotographerProfile,
    updatePhotographerProfile,
    getPhotographerPosts,
    createPost,
    toggleLike,
    getComments,
    createComment
} from "../api/api";


function PhotographerMyProfile({
    onBack
}) {

    const [profile, setProfile] =
        useState(null);

    const [posts, setPosts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showEdit, setShowEdit] =
        useState(false);

    const [showCreatePost, setShowCreatePost] =
        useState(false);


    /* =================================================
       EDIT PROFILE FORM
    ================================================= */

    const [profileForm, setProfileForm] =
        useState({
            location: "",
            specialization: "",
            experience: 0,
            pricePerEvent: 0,
            phone: "",
            profileImage: "",
            isAvailable: true
        });


    /* =================================================
       CREATE POST FORM
    ================================================= */

    const [postForm, setPostForm] =
        useState({
            imageUrl: "",
            caption: "",
            location: "",
            category: "Wedding"
        });


    /* =================================================
       POST COMMENTS
    ================================================= */

    const [openComments, setOpenComments] =
        useState(null);

    const [comments, setComments] =
        useState({});

    const [commentText, setCommentText] =
        useState({});


    /* =================================================
       LOAD PROFILE
    ================================================= */

    const loadProfile =
        async () => {

            try {

                setLoading(true);

                setError("");


                const token =
                    localStorage.getItem(
                        "token"
                    );


                const profileData =
                    await getMyPhotographerProfile(
                        token
                    );


                const myProfile =
                    profileData.profile ||
                    profileData.photographer ||
                    profileData;


                setProfile(
                    myProfile
                );


                setProfileForm({

                    location:
                        myProfile.location ||
                        "",

                    specialization:
                        myProfile.specialization ||
                        "",

                    experience:
                        myProfile.experience ||
                        0,

                    pricePerEvent:
                        myProfile.pricePerEvent ||
                        0,

                    phone:
                        myProfile.phone ||
                        "",

                    profileImage:
                        myProfile.profileImage ||
                        "",

                    isAvailable:
                        myProfile.isAvailable !== false

                });


                const userId =
                    myProfile.user?._id ||
                    localStorage.getItem(
                        "userId"
                    );


                if (userId) {

                    const postsData =
                        await getPhotographerPosts(
                            token,
                            userId
                        );


                    const sortedPosts =
                        [...(
                            postsData.posts ||
                            []
                        )].sort(
                            (a, b) =>
                                new Date(
                                    b.createdAt
                                ) -
                                new Date(
                                    a.createdAt
                                )
                        );


                    setPosts(
                        sortedPosts
                    );

                }

            } catch (err) {

                console.error(
                    "My Profile Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load profile"
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadProfile();

    }, []);


    /* =================================================
       EDIT PROFILE
    ================================================= */

    const handleProfileChange =
        (e) => {

            const {
                name,
                value
            } = e.target;


            setProfileForm(
                previous => ({
                    ...previous,
                    [name]: value
                })
            );

        };


    const handleUpdateProfile =
        async (e) => {

            e.preventDefault();


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                await updatePhotographerProfile(
                    token,
                    {
                        ...profileForm,

                        experience:
                            Number(
                                profileForm.experience
                            ),

                        pricePerEvent:
                            Number(
                                profileForm.pricePerEvent
                            )
                    }
                );


                alert(
                    "Profile updated successfully!"
                );


                setShowEdit(false);

                await loadProfile();


            } catch (err) {

                console.error(
                    "Update Profile Error:",
                    err
                );

                alert(
                    err.message ||
                    "Failed to update profile"
                );

            }

        };


    /* =================================================
       CREATE POST
    ================================================= */

    const handlePostChange =
        (e) => {

            const {
                name,
                value
            } = e.target;


            setPostForm(
                previous => ({
                    ...previous,
                    [name]: value
                })
            );

        };


    const handleCreatePost =
        async (e) => {

            e.preventDefault();


            if (
                !postForm.imageUrl.trim()
            ) {

                alert(
                    "Please enter an image URL."
                );

                return;

            }


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const data =
                    await createPost(
                        token,
                        postForm
                    );


                setPosts(
                    previous => [
                        data.post,
                        ...previous
                    ]
                );


                setPostForm({

                    imageUrl: "",
                    caption: "",
                    location: "",
                    category: "Wedding"

                });


                setShowCreatePost(
                    false
                );


                alert(
                    "Photo posted successfully!"
                );


            } catch (err) {

                console.error(
                    "Create Post Error:",
                    err
                );

                alert(
                    err.message ||
                    "Failed to create post"
                );

            }

        };


    /* =================================================
       LIKE
    ================================================= */

    /* =================================================
   LIKE / UNLIKE
================================================= */

const handleLike =
    async (postId) => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            const data =
                await toggleLike(
                    token,
                    postId
                );


            setPosts(
                previous =>
                    previous.map(
                        post => {

                            if (
                                post._id ===
                                postId
                            ) {

                                return {

                                    ...post,

                                    likes:
                                        data.likes ||
                                        post.likes,

                                    likedByMe:
                                        data.likedByMe

                                };

                            }


                            return post;

                        }
                    )
            );


        } catch (err) {

            console.error(
                "Like Error:",
                err
            );

        }

    };


    /* =================================================
       LOAD COMMENTS
    ================================================= */

    const handleToggleComments =
        async (postId) => {

            if (
                openComments ===
                postId
            ) {

                setOpenComments(null);

                return;

            }


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const data =
                    await getComments(
                        token,
                        postId
                    );


                setComments(
                    previous => ({
                        ...previous,
                        [postId]:
                            data.comments ||
                            []
                    })
                );


                setOpenComments(
                    postId
                );


            } catch (err) {

                console.error(
                    "Comments Error:",
                    err
                );

            }

        };


    /* =================================================
       ADD COMMENT
    ================================================= */

    const handleAddComment =
        async (postId) => {

            const text =
                commentText[postId] ||
                "";


            if (
                !text.trim()
            ) {

                return;

            }


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const data =
                    await createComment(
                        token,
                        postId,
                        text
                    );


                setComments(
                    previous => ({
                        ...previous,

                        [postId]: [
                            ...(previous[postId] || []),
                            data.comment
                        ]
                    })
                );


                setCommentText(
                    previous => ({
                        ...previous,
                        [postId]: ""
                    })
                );


            } catch (err) {

                console.error(
                    "Comment Error:",
                    err
                );

            }

        };


    if (loading) {

        return (

            <div className="my-profile-page">

                <div className="profile-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your profile...
                    </p>

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="my-profile-page">

                <div className="home-error">

                    {error}

                </div>

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

            </div>

        );

    }


    const user =
        profile?.user || {};


    const photographerName =
        user.name ||
        "Photographer";


    const profileImage =
        profile?.profileImage ||
        user.profileImage ||
        "";


    return (

        <div className="my-profile-page">


            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="my-profile-topbar">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>


                <h1>
                    My Profile
                </h1>


                <div className="profile-top-actions">

                    <button
                        className="profile-edit-button"

                        onClick={() =>
                            setShowEdit(
                                !showEdit
                            )
                        }
                    >

                        ✎ Edit Profile

                    </button>


                    <button
                        className="create-post-button"

                        onClick={() =>
                            setShowCreatePost(
                                !showCreatePost
                            )
                        }
                    >

                        ＋ Create Post

                    </button>

                </div>

            </div>


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <section className="my-profile-header">


                <div className="my-profile-avatar">

                    {profileImage ? (

                        <img
                            src={
                                profileImage
                            }
                            alt={
                                photographerName
                            }
                        />

                    ) : (

                        <span>

                            {
                                photographerName
                                    .charAt(0)
                                    .toUpperCase()
                            }

                        </span>

                    )}

                </div>


                <div className="my-profile-main-info">

                    <div className="my-profile-name-row">

                        <h2>
                            {photographerName}
                        </h2>

                        <span className="my-profile-role">
                            PHOTOGRAPHER
                        </span>

                    </div>


                    <div className="my-profile-stats">

                        <div>

                            <strong>
                                {posts.length}
                            </strong>

                            <span>
                                posts
                            </span>

                        </div>


                        <div>

                            <strong>
                                {
                                    posts.reduce(
                                        (
                                            total,
                                            post
                                        ) =>
                                            total +
                                            (
                                                post.likes?.length ||
                                                0
                                            ),
                                        0
                                    )
                                }
                            </strong>

                            <span>
                                likes
                            </span>

                        </div>

                    </div>


                    <p className="my-profile-specialization">

                        📷{" "}

                        {
                            profile?.specialization ||
                            "Photography"
                        }

                    </p>


                    <p>

                        📍{" "}

                        {
                            profile?.location ||
                            "Location not specified"
                        }

                    </p>


                    <p>

                        💼{" "}

                        {
                            profile?.experience ||
                            0
                        } years experience

                    </p>


                    <p>

                        💰 From ₹
                        {
                            Number(
                                profile?.pricePerEvent ||
                                0
                            ).toLocaleString(
                                "en-IN"
                            )}

                    </p>


                    <span
                        className={
                            profile?.isAvailable
                                ? "profile-available"
                                : "profile-unavailable"
                        }
                    >

                        ●{" "}

                        {
                            profile?.isAvailable
                                ? "Available for bookings"
                                : "Currently unavailable"
                        }

                    </span>

                </div>

            </section>


            {/* =================================================
                EDIT PROFILE
            ================================================= */}

            {showEdit && (

                <section className="profile-edit-section">

                    <div className="profile-form-header">

                        <span>
                            PROFILE SETTINGS
                        </span>

                        <h2>
                            Edit Your Profile
                        </h2>

                        <p>
                            Keep your photographer
                            information up to date.
                        </p>

                    </div>


                    <form
                        className="profile-edit-form"

                        onSubmit={
                            handleUpdateProfile
                        }
                    >


                        <div className="profile-form-grid">


                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={
                                        profileForm.location
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Madurai"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Specialization
                                </label>

                                <input
                                    name="specialization"
                                    value={
                                        profileForm.specialization
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="Wedding, Candid"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Experience
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="experience"
                                    value={
                                        profileForm.experience
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Price Per Event
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="pricePerEvent"
                                    value={
                                        profileForm.pricePerEvent
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={
                                        profileForm.phone
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Profile Image URL
                                </label>

                                <input
                                    name="profileImage"
                                    value={
                                        profileForm.profileImage
                                    }
                                    onChange={
                                        handleProfileChange
                                    }
                                    placeholder="https://..."
                                />

                            </div>


                        </div>


                        <label className="availability-checkbox">

                            <input
                                type="checkbox"
                                checked={
                                    profileForm.isAvailable
                                }
                                onChange={(e) =>
                                    setProfileForm(
                                        previous => ({
                                            ...previous,
                                            isAvailable:
                                                e.target.checked
                                        })
                                    )
                                }
                            />

                            Available for bookings

                        </label>


                        <div className="profile-form-actions">

                            <button
                                type="button"
                                className="secondary-profile-button"

                                onClick={() =>
                                    setShowEdit(false)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-profile-button"
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>

                </section>

            )}


            {/* =================================================
                CREATE POST
            ================================================= */}

            {showCreatePost && (

                <section className="create-post-section">


                    <div className="create-post-heading">

                        <span>
                            SHARE YOUR WORK
                        </span>

                        <h2>
                            Create New Post
                        </h2>

                        <p>
                            Share your best photography
                            with the SnapBook community.
                        </p>

                    </div>


                    <form
                        className="create-post-form"

                        onSubmit={
                            handleCreatePost
                        }
                    >


                        <div className="form-group">

                            <label>
                                Photo URL
                            </label>

                            <input
                                type="url"
                                name="imageUrl"
                                value={
                                    postForm.imageUrl
                                }
                                onChange={
                                    handlePostChange
                                }
                                placeholder="https://example.com/your-photo.jpg"
                                required
                            />

                            <small>
                                Paste a direct URL to
                                your photography image.
                            </small>

                        </div>


                        {postForm.imageUrl && (

                            <div className="post-preview">

                                <img
                                    src={
                                        postForm.imageUrl
                                    }
                                    alt="Preview"
                                />

                            </div>

                        )}


                        <div className="form-group">

                            <label>
                                Caption
                            </label>

                            <textarea
                                name="caption"
                                value={
                                    postForm.caption
                                }
                                onChange={
                                    handlePostChange
                                }
                                placeholder="Tell people about this photograph..."
                                rows="4"
                            />

                        </div>


                        <div className="create-post-grid">


                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={
                                        postForm.location
                                    }
                                    onChange={
                                        handlePostChange
                                    }
                                    placeholder="Madurai"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        postForm.category
                                    }
                                    onChange={
                                        handlePostChange
                                    }
                                >

                                    <option>
                                        Wedding
                                    </option>

                                    <option>
                                        Candid
                                    </option>

                                    <option>
                                        Pre-Wedding
                                    </option>

                                    <option>
                                        Birthday
                                    </option>

                                    <option>
                                        Engagement
                                    </option>

                                    <option>
                                        Corporate
                                    </option>

                                    <option>
                                        Nature
                                    </option>

                                    <option>
                                        Portrait
                                    </option>

                                    <option>
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="create-post-actions">

                            <button
                                type="button"
                                className="secondary-profile-button"

                                onClick={() =>
                                    setShowCreatePost(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-profile-button"
                            >
                                Publish Post
                            </button>

                        </div>

                    </form>

                </section>

            )}


            {/* =================================================
                POSTS
            ================================================= */}

            <section className="my-posts-section">


                <div className="my-posts-heading">

                    <div>

                        <span>
                            PORTFOLIO
                        </span>

                        <h2>
                            My Posts
                        </h2>

                    </div>

                </div>


                {posts.length === 0 ? (

                    <div className="my-posts-empty">

                        <div>
                            📷
                        </div>

                        <h3>
                            No posts yet
                        </h3>

                        <p>
                            Share your first photograph
                            with the SnapBook community.
                        </p>

                        <button
                            className="create-post-button"

                            onClick={() =>
                                setShowCreatePost(
                                    true
                                )
                            }
                        >
                            ＋ Create Your First Post
                        </button>

                    </div>

                ) : (

                    <div className="my-posts-grid">

                        {posts.map(
                            post => (

                                <article
                                    className="my-post-card"
                                    key={
                                        post._id
                                    }
                                >

                                    <div className="my-post-image">

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


                                    <div className="my-post-content">

                                        {post.caption && (

                                            <p>
                                                {post.caption}
                                            </p>

                                        )}


                                        <div className="my-post-meta">

                                            <span>

                                                📍{" "}

                                                {
                                                    post.location ||
                                                    "India"
                                                }

                                            </span>


                                            <span>

                                                #
                                                {
                                                    post.category
                                                }

                                            </span>

                                        </div>


                                        <div className="my-post-actions">

                                            <button
                                                className={`my-post-like-button ${
                                                    post.likedByMe
                                                        ? "liked"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleLike(
                                                        post._id
                                                    )
                                                }
                                            >

                                                <span>

                                                    {post.likedByMe
                                                        ? "♥"
                                                        : "♡"}

                                                </span>

                                                {post.likes?.length || 0}

                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleToggleComments(
                                                        post._id
                                                    )
                                                }
                                            >

                                                💬 Comments

                                            </button>

                                        </div>


                                        {openComments ===
                                            post._id && (

                                            <div className="post-comments">

                                                <div className="comments-list">

                                                    {
                                                        (
                                                            comments[
                                                                post._id
                                                            ] ||
                                                            []
                                                        ).length === 0 ? (

                                                            <p className="no-comments">
                                                                No comments yet.
                                                            </p>

                                                        ) : (

                                                            comments[
                                                                post._id
                                                            ].map(
                                                                comment => (

                                                                    <div
                                                                        className="comment-item"
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

                                                        )
                                                    }

                                                </div>


                                                <div className="comment-input-row">

                                                    <input
                                                        type="text"
                                                        placeholder="Write a comment..."
                                                        value={
                                                            commentText[
                                                                post._id
                                                            ] ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setCommentText(
                                                                previous => ({
                                                                    ...previous,
                                                                    [post._id]:
                                                                        e.target.value
                                                                })
                                                            )
                                                        }

                                                        onKeyDown={(e) => {

                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {

                                                                e.preventDefault();

                                                                handleAddComment(
                                                                    post._id
                                                                );

                                                            }

                                                        }}
                                                    />


                                                    <button
                                                        onClick={() =>
                                                            handleAddComment(
                                                                post._id
                                                            )
                                                        }
                                                    >
                                                        Post
                                                    </button>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );

}


export default PhotographerMyProfile;