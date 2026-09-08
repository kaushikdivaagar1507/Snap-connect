import { useEffect, useState } from "react";

import {
    getMyPhotographerProfile,
    updatePhotographerProfile
} from "../api/api";

function EditPhotographerProfile({ onBack }) {

    const [form, setForm] = useState({
        location: "",
        specialization: "",
        experience: "",
        pricePerEvent: "",
        phone: "",
        isAvailable: true,
        profileImage: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);

                const token =
                    localStorage.getItem("token");

                const data =
                    await getMyPhotographerProfile(token);

                const profile = data.profile;

                setForm({
                    location: profile.location || "",
                    specialization:
                        profile.specialization || "",
                    experience:
                        profile.experience || "",
                    pricePerEvent:
                        profile.pricePerEvent || "",
                    phone: profile.phone || "",
                    isAvailable:
                        profile.isAvailable ?? true,
                    profileImage:
                        profile.profileImage || ""
                });

            } catch (err) {
                console.error(
                    "Load Profile Error:",
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

        loadProfile();
    }, []);

    const handleChange = (e) => {

        const { name, value, type, checked } =
            e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token");

            const profileData = {
                location: form.location,
                specialization:
                    form.specialization,
                experience:
                    Number(form.experience),
                pricePerEvent:
                    Number(form.pricePerEvent),
                phone: form.phone,
                isAvailable:
                    form.isAvailable,
                profileImage:
                    form.profileImage
            };

            await updatePhotographerProfile(
                token,
                profileData
            );

            setSuccess(
                "Profile updated successfully! 🎉"
            );

        } catch (err) {

            console.error(
                "Update Profile Error:",
                err
            );

            setError(
                err.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-profile-page">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div className="edit-profile-loading">
                    Loading profile...
                </div>

            </div>
        );
    }

    return (
        <div className="edit-profile-page">

            <div className="edit-profile-header">

                <button
                    className="back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div>
                    <h1>Edit Photographer Profile</h1>

                    <p>
                        Update your photography
                        business information
                    </p>
                </div>

            </div>

            <div className="edit-profile-card">

                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="dashboard-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Example: Madurai"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Specialization
                        </label>

                        <input
                            type="text"
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            placeholder="Wedding, Candid, Pre-Wedding"
                            required
                        />

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Experience
                            </label>

                            <input
                                type="number"
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                                min="0"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Price per Event
                            </label>

                            <input
                                type="number"
                                name="pricePerEvent"
                                value={form.pricePerEvent}
                                onChange={handleChange}
                                min="0"
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Phone number"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Profile Image URL
                        </label>

                        <input
                            type="url"
                            name="profileImage"
                            value={form.profileImage}
                            onChange={handleChange}
                            placeholder="https://..."
                        />

                    </div>

                    <div className="availability-row">

                        <label>
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={form.isAvailable}
                                onChange={handleChange}
                            />

                            <span>
                                Available for bookings
                            </span>
                        </label>

                    </div>

                    <div className="edit-profile-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onBack}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-profile-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditPhotographerProfile;