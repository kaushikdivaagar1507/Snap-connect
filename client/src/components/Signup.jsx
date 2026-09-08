import { useState } from "react";
import { registerUser } from "../api/api";

function Signup({ onSignupSuccess, onSwitchToLogin }) {
    const [role, setRole] = useState("CLIENT");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload = {
                ...formData,
                role
            };

            const response = await registerUser(payload);
            
            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            if (onSignupSuccess) {
                onSignupSuccess(response.user);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>

            <div className="role-toggle-buttons" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    type="button"
                    className={role === "CLIENT" ? "active-tab" : ""}
                    onClick={() => setRole("CLIENT")}
                >
                    I want to Book (Client)
                </button>
                <button
                    type="button"
                    className={role === "PHOTOGRAPHER" ? "active-tab" : ""}
                    onClick={() => setRole("PHOTOGRAPHER")}
                >
                    I am a Photographer
                </button>
            </div>

            {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {role === "PHOTOGRAPHER" && (
                    <>
                        <div>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Location / City</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Mumbai, India"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit" disabled={loading} style={{ marginTop: "15px" }}>
                    {loading
                        ? "Registering..."
                        : `Sign Up as ${role === "PHOTOGRAPHER" ? "Photographer" : "Client"}`}
                </button>
            </form>

            <p style={{ marginTop: "15px" }}>
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToLogin}>
                    Login
                </button>
            </p>
        </div>
    );
}

export default Signup;