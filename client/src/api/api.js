const API_BASE_URL = "http://localhost:5000/api";

export const getAllPosts = async (token) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return await response.json();
};

export const toggleLike = async (token, postId) => {
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

    if (!response.ok) {
        throw new Error("Failed to like post");
    }

    return await response.json();
};

export const getComments = async (token, postId) => {
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

    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }

    return await response.json();
};


export const createComment = async (token, postId, text) => {
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

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add comment");
    }

    return await response.json();
};

/*export const getPhotographers = async (token) => {
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

    if (!response.ok) {
        throw new Error("Failed to fetch photographers");
    }

    return await response.json();
};*/


export const getPhotographerById = async (token, id) => {
    const response = await fetch(
        `${API_BASE_URL}/photographers/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch photographer");
    }

    return await response.json();
};


export const getPhotographerPosts = async (token, photographerId) => {
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

    if (!response.ok) {
        throw new Error("Failed to fetch photographer posts");
    }

    return await response.json();
};
export const registerUser = async (userData) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Signup failed");
    }
    return data;
};

export const createBooking = async (token, bookingData) => {
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
            data.message || "Failed to create booking"
        );
    }

    return data;
};

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
            data.message || "Failed to fetch bookings"
        );
    }

    return data;
};
// ==========================================
// PHOTOGRAPHER BOOKINGS
// ==========================================

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
            data.message || "Failed to fetch photographer bookings"
        );
    }

    return data;
};


// ==========================================
// ACCEPT BOOKING
// ==========================================

export const acceptBooking = async (token, bookingId) => {

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
            data.message || "Failed to accept booking"
        );
    }

    return data;
};


// ==========================================
// REJECT BOOKING
// ==========================================

export const rejectBooking = async (token, bookingId) => {

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
            data.message || "Failed to reject booking"
        );
    }

    return data;
};

export const getMyPhotographerProfile = async (token) => {
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
            data.message || "Failed to fetch photographer profile"
        );
    }

    return data;
};

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
            data.message || "Failed to update profile"
        );
    }

    return data;
};

export const getPhotographers = async (token, filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.specialization && filters.specialization !== "ALL") {
        queryParams.append("specialization", filters.specialization);
    }
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);

    const endpoint = queryParams.toString() 
        ? `${API_BASE_URL}/photographers?${queryParams.toString()}` 
        : `${API_BASE_URL}/photographers`;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch photographers");
    }

    return await response.json();
};

// Add or verify this function in src/api/api.js

export const getPhotographerProfile = async (photographerId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/photographers/${photographerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch photographer profile");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getPhotographerProfile:", error);
        throw error;
    }
};
