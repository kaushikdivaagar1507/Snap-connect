import { useState } from "react";

function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save Auth details
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
      }

      if (onLogin) onLogin();

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainWrapper}>

        {/* Left Side: Mock Phone Feature Showcase */}
        <div style={styles.phoneMockup}>
          <div style={styles.phoneFrame}>
            <div style={styles.phoneScreen}>
              <div style={styles.heroContent}>
                <span style={{ fontSize: "42px", marginBottom: "12px" }}>📸</span>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>SnapConnect</h3>
                <p style={{ color: "#a8a8a8", fontSize: "13px", margin: 0, lineHeight: "1.4" }}>
                  Discover, book, and collaborate with top photographers around the world.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Instagram-Style Login Container */}
        <div style={styles.authContainer}>

          {/* Primary Login Card */}
          <div style={styles.card}>
            <h1 style={styles.logoText}>
              Snap<span style={{ color: "#0095f6" }}>Connect</span>
            </h1>

            <p style={styles.subtitle}>
              Connect with the best photographers
            </p>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                style={{
                  ...styles.submitBtn,
                  opacity: loading || !email || !password ? 0.6 : 1,
                  cursor: loading || !email || !password ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>OR</span>
              <div style={styles.dividerLine} />
            </div>

            <a href="#forgot" style={styles.forgotLink}>
              Forgot password?
            </a>
          </div>

          {/* Secondary Sign Up Box */}
          <div style={styles.cardSecondary}>
            <p style={{ margin: 0, fontSize: "14px", color: "#f5f5f5" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onNavigateToRegister}
                style={styles.signupBtn}
              >
                Sign up
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

// Modern Instagram Dark Palette
const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#000000",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: "20px"
  },
  mainWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "36px",
    width: "100%",
    maxWidth: "820px"
  },
  phoneMockup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  phoneFrame: {
    width: "260px",
    height: "480px",
    border: "10px solid #262626",
    borderRadius: "36px",
    backgroundColor: "#121212",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
  },
  phoneScreen: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    textAlign: "center"
  },
  heroContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    maxWidth: "350px"
  },
  card: {
    backgroundColor: "#000000",
    border: "1px solid #262626",
    borderRadius: "8px",
    padding: "36px 30px 24px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  logoText: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    color: "#a8a8a8",
    fontSize: "13px",
    margin: "0 0 24px 0",
    textAlign: "center"
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  inputWrapper: {
    width: "100%"
  },
  input: {
    width: "100%",
    padding: "11px 10px",
    backgroundColor: "#121212",
    border: "1px solid #262626",
    borderRadius: "4px",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box"
  },
  submitBtn: {
    width: "100%",
    padding: "9px",
    marginTop: "6px",
    backgroundColor: "#0095f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s"
  },
  errorMessage: {
    backgroundColor: "rgba(237, 73, 86, 0.15)",
    color: "#ed4956",
    border: "1px solid #ed4956",
    borderRadius: "4px",
    padding: "8px",
    fontSize: "12px",
    marginBottom: "14px",
    width: "100%",
    textAlign: "center"
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    margin: "20px 0 16px 0"
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#262626"
  },
  dividerText: {
    color: "#a8a8a8",
    fontSize: "12px",
    fontWeight: "600",
    padding: "0 16px"
  },
  forgotLink: {
    color: "#e0e0e0",
    fontSize: "12px",
    textDecoration: "none"
  },
  cardSecondary: {
    backgroundColor: "#000000",
    border: "1px solid #262626",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center"
  },
  signupBtn: {
    background: "none",
    border: "none",
    color: "#0095f6",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    padding: 0
  }
};

export default Login;