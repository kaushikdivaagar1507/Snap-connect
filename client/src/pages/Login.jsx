import { useState } from "react";
import { loginUser } from "../api/api";

function Login({ onLogin, onSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser({
                email,
                password
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);

            if (onLogin) {
                onLogin();
            }

        } catch (error) {
            console.error("Login Error:", error);

            setError(
                error.message ||
                "Login failed. Please check your credentials."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* Left Side */}
            <div className="auth-visual">

                <div className="auth-brand">
                    <div className="brand-icon">✦</div>

                    <span>SnapBook</span>
                </div>

                <div className="auth-visual-content">

                    <p className="auth-eyebrow">
                        CAPTURE • CONNECT • CREATE
                    </p>

                    <h1>
                        Every moment
                        <br />
                        deserves a story.
                    </h1>

                    <p>
                        Discover talented photographers,
                        share beautiful moments and turn
                        your special events into memories
                        that last forever.
                    </p>

                </div>

                <div className="auth-visual-footer">
                    <span>Photography marketplace</span>
                    <span>✦</span>
                    <span>Made for creators</span>
                </div>

            </div>


            {/* Right Side */}
            <div className="auth-form-section">

                <div className="auth-form-wrapper">

                    <div className="mobile-brand">
                        <div className="brand-icon">✦</div>
                        <span>SnapBook</span>
                    </div>

                    <div className="auth-heading">

                        <span className="auth-small-title">
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to SnapBook
                        </h2>

                        <p>
                            Continue your photography journey.
                        </p>

                    </div>


                    {error && (
                        <div className="auth-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

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
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                        </div>


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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>New to SnapBook?</span>
                    </div>


                    <button
                        type="button"
                        className="signup-outline-btn"
                        onClick={onSignup}
                    >
                        Create a new account
                    </button>


                    <p className="auth-terms">
                        By continuing, you agree to our
                        <span> Terms of Service</span>
                        {" "}and
                        <span> Privacy Policy</span>.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;