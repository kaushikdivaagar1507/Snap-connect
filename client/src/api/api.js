const API_BASE_URL = "http://localhost:5000/api";

/* =========================
   AUTH
========================= */

// ======================================================
// LOGIN
// ======================================================

export const loginUser = async (credentials) => {

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(credentials)
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Login failed"
        );

    }

    return data;
};


// ======================================================
// REGISTER
// ======================================================

export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Registration failed"
        );

    }

    return data;
};


/* =========================
   POSTS
========================= */

// ======================================================
// GET ALL POSTS
// ======================================================

export const getAllPosts = async (token) => {

    const response = await fetch(
        `${API_BASE_URL}/posts`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch posts"
        );

    }

    return data;
};

// ======================================================
// LIKE POST
// ======================================================

export const toggleLike = async (
    token,
    postId
) => {

    const response = await fetch(
        `${API_BASE_URL}/posts/${postId}/like`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to like post"
        );

    }

    return data;
};


/* =========================
   COMMENTS
========================= */

export const getComments = async (
    token,
    postId
) => {

    const response = await fetch(
        `${API_BASE_URL}/posts/${postId}/comments`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch comments"
        );

    }

    return data;
};


// ======================================================
// CREATE COMMENT
// ======================================================

export const createComment = async (
    token,
    postId,
    text
) => {

    const response = await fetch(
        `${API_BASE_URL}/posts/${postId}/comments`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to create comment"
        );

    }

    return data;
};


/* =========================
   PHOTOGRAPHERS
========================= */

// ======================================================
// GET PHOTOGRAPHERS
// ======================================================

export const getPhotographers = async (token) => {

    const response = await fetch(
        `${API_BASE_URL}/photographers`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch photographers"
        );

    }

    return data;
};


// GET SINGLE PHOTOGRAPHER
// ======================================================

export const getPhotographerById = async (
    token,
    photographerId
) => {

    const response = await fetch(
        `${API_BASE_URL}/photographers/${photographerId}`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch photographer"
        );

    }

    return data;
};


// GET PHOTOGRAPHER POSTS
// ======================================================

export const getPhotographerPosts = async (
    token,
    photographerId
) => {

    const response = await fetch(
        `${API_BASE_URL}/posts/photographer/${photographerId}`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch photographer posts"
        );

    }

    return data;
};


/* =========================
   BOOKINGS
========================= */

export const createBooking = async (
    token,
    bookingData
) => {

    const response = await fetch(
        `${API_BASE_URL}/bookings`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bookingData)
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to create booking"
        );

    }

    return data;
};


// ======================================================
// CLIENT - MY BOOKINGS
// ======================================================

export const getMyBookings = async (token) => {

    const response = await fetch(
        `${API_BASE_URL}/bookings/my`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch bookings"
        );

    }

    return data;
};


// ======================================================
// PHOTOGRAPHER - BOOKINGS
// ======================================================

export const getPhotographerBookings = async (token) => {

    const response = await fetch(
        `${API_BASE_URL}/bookings/photographer`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch photographer bookings"
        );

    }

    return data;
};


// ======================================================
// ACCEPT BOOKING
// ======================================================

export const acceptBooking = async (
    token,
    bookingId
) => {

    const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/accept`,
        {
            method: "PATCH",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to accept booking"
        );

    }

    return data;
};


// REJECT BOOKING
// ======================================================

export const rejectBooking = async (
    token,
    bookingId
) => {

    const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/reject`,
        {
            method: "PATCH",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to reject booking"
        );

    }

    return data;
};


/* =========================
   PHOTOGRAPHER PROFILE
========================= */

// GET MY PHOTOGRAPHER PROFILE
// ======================================================

export const getMyPhotographerProfile = async (
    token
) => {

    const response = await fetch(
        `${API_BASE_URL}/photographers/profile/me`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch photographer profile"
        );

    }

    return data;
};

// ======================================================
// UPDATE PHOTOGRAPHER PROFILE
// ======================================================
export const updatePhotographerProfile = async (
    token,
    profileData
) => {

    const response = await fetch(
        `${API_BASE_URL}/photographers/profile`,
        {
            method: "PUT",

            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profileData)
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to update profile"
        );

    }

    return data;
};
export const createPost = async (
    token,
    postData
) => {
    const response = await fetch(
        `${API_BASE_URL}/posts`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create post"
        );
    }

    return data;
};