import { useState } from "react";
import { registerUser } from "../api/api";

function Signup({ onSignup, onBackToLogin }) {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CLIENT"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError(
                "Please fill in all required fields."
            );

            return;
        }


        if (formData.name.trim().length < 2) {
            setError(
                "Name must contain at least 2 characters."
            );

            return;
        }


        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);

            const data = await registerUser(formData);

            console.log(
                "Registration successful:",
                data
            );

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );


            setFormData({
                name: "",
                email: "",
                password: "",
                role: "CLIENT"
            });


            setTimeout(() => {

                if (onSignup) {
                    onSignup();
                }

            }, 1500);


        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );

            setError(
                error.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-page signup-page">

            {/* Left Side */}
            <div className="auth-visual signup-visual">

                <div className="auth-brand">

                    <div className="brand-icon">
                        ✦
                    </div>

                    <span>
                        SnapBook
                    </span>

                </div>


                <div className="auth-visual-content">

                    <p className="auth-eyebrow">
                        YOUR STORY STARTS HERE
                    </p>

                    <h1>
                        Create.
                        <br />
                        Capture.
                        <br />
                        Connect.
                    </h1>

                    <p>
                        Join a community where photographers
                        showcase their talent and clients find
                        the perfect person to capture their
                        unforgettable moments.
                    </p>


                    <div className="signup-features">

                        <div className="signup-feature">

                            <div className="feature-icon">
                                📷
                            </div>

                            <div>
                                <strong>
                                    Discover photographers
                                </strong>

                                <span>
                                    Find talent for every occasion
                                </span>
                            </div>

                        </div>


                        <div className="signup-feature">

                            <div className="feature-icon">
                                ✨
                            </div>

                            <div>
                                <strong>
                                    Share your creativity
                                </strong>

                                <span>
                                    Showcase your photography
                                </span>
                            </div>

                        </div>


                        <div className="signup-feature">

                            <div className="feature-icon">
                                🤝
                            </div>

                            <div>
                                <strong>
                                    Connect & book
                                </strong>

                                <span>
                                    Turn connections into memories
                                </span>
                            </div>

                        </div>

                    </div>

                </div>


                <div className="auth-visual-footer">

                    <span>
                        Photography marketplace
                    </span>

                    <span>✦</span>

                    <span>
                        Made for creators
                    </span>

                </div>

            </div>


            {/* Right Side */}
            <div className="auth-form-section">

                <div className="auth-form-wrapper signup-form-wrapper">

                    <div className="mobile-brand">

                        <div className="brand-icon">
                            ✦
                        </div>

                        <span>
                            SnapBook
                        </span>

                    </div>


                    <div className="auth-heading">

                        <span className="auth-small-title">
                            JOIN SNAPBOOK
                        </span>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Start capturing moments that matter.
                        </p>

                    </div>


                    {error && (
                        <div className="auth-error">

                            <span>!</span>

                            {error}

                        </div>
                    )}


                    {success && (
                        <div className="auth-success">

                            <span>✓</span>

                            {success}

                        </div>
                    )}


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Name */}

                        <div className="form-group">

                            <label>
                                Full name
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ♙
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label>
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ●
                                </span>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* Account Type */}

                        <div className="form-group">

                            <label>
                                I want to join as
                            </label>

                            <div className="role-selection">

                                <label
                                    className={`role-card ${
                                        formData.role === "CLIENT"
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="CLIENT"
                                        checked={
                                            formData.role === "CLIENT"
                                        }
                                        onChange={handleChange}
                                    />

                                    <div className="role-card-icon">
                                        👤
                                    </div>

                                    <div className="role-card-content">

                                        <strong>
                                            Client
                                        </strong>

                                        <span>
                                            Find & book photographers
                                        </span>

                                    </div>

                                    <div className="role-check">
                                        ✓
                                    </div>

                                </label>


                                <label
                                    className={`role-card ${
                                        formData.role === "PHOTOGRAPHER"
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="role"
                                        value="PHOTOGRAPHER"
                                        checked={
                                            formData.role === "PHOTOGRAPHER"
                                        }
                                        onChange={handleChange}
                                    />

                                    <div className="role-card-icon">
                                        📷
                                    </div>

                                    <div className="role-card-content">

                                        <strong>
                                            Photographer
                                        </strong>

                                        <span>
                                            Showcase & get bookings
                                        </span>

                                    </div>

                                    <div className="role-check">
                                        ✓
                                    </div>

                                </label>

                            </div>

                        </div>


                        {/* Submit */}

                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>Already have an account?</span>
                    </div>


                    <button
                        type="button"
                        className="signup-outline-btn"
                        onClick={onBackToLogin}
                    >
                        Back to Sign In
                    </button>


                    <p className="auth-terms">

                        By creating an account, you agree to our
                        <span> Terms of Service</span>
                        {" "}and
                        <span> Privacy Policy</span>.

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Signup;