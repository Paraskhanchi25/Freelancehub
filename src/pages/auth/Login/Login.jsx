import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectMessage = location.state?.message;
  const redirectTarget = location.state?.from;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedUser = await login(email, password);

      // Safe local redirect check (prevents open redirects and verifies role match)
      const isSafeLocal =
        redirectTarget &&
        typeof redirectTarget === "string" &&
        redirectTarget.startsWith("/") &&
        !redirectTarget.startsWith("//");

      const targetRole = location.state?.targetRole;

      if (isSafeLocal) {
        if (!targetRole || targetRole === loggedUser.role) {
          navigate(redirectTarget, { replace: true });
          return;
        }
        const userHome =
          loggedUser.role === "admin"
            ? "/admin-dashboard"
            : loggedUser.role === "freelancer"
            ? "/freelancer-dashboard"
            : "/client-dashboard";

        navigate(userHome, {
          replace: true,
          state: {
            message: `Welcome, ${loggedUser.name}! Note: "${redirectTarget}" is restricted to ${targetRole} accounts.`,
          },
        });
        return;
      }

      if (loggedUser.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (loggedUser.role === "freelancer") {
        navigate("/freelancer-dashboard", { replace: true });
      } else {
        navigate("/client-dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <Link to="/" className="auth-brand">
          <span className="brand-bolt">⚡</span>
          <span className="brand-name">
            Freelance<span className="brand-accent">Hub</span>
          </span>
        </Link>

        <h1 className="auth-heading">Welcome Back</h1>
        <p className="auth-subheading">
          Log in to your account to manage projects, proposals, and contracts.
        </p>

        {redirectMessage && (
          <div className="auth-banner banner-info">
            <span>🔒 {redirectMessage}</span>
          </div>
        )}

        {error && (
          <div className="auth-banner banner-danger">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field-group">
            <div className="field-label-row">
              <label htmlFor="password">Password</label>
              <span className="field-hint">Any password for test accounts</span>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? "Signing in..." : "Log In to Account →"}
          </button>
        </form>

        {/* Quick Demo Pre-fill Accounts */}
        <div className="auth-demo-box">
          <span className="demo-box-title">🚀 Quick Demo One-Click Fill:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickDemo("himakshi@example.com", "password123")}
            >
              👤 Client (Himakshi)
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickDemo("paras@example.com", "password123")}
            >
              💼 Freelancer (Paras)
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickDemo("admin@freelancehub.com", "password123")}
            >
              👑 Platform Admin
            </button>
          </div>
        </div>

        <div className="auth-card-footer">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link to="/signup" className="auth-footer-link">
              Create an Account
            </Link>
          </p>
          <Link to="/" className="auth-home-link">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;