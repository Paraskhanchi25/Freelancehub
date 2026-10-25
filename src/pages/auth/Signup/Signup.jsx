import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    title: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service & Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        title:
          formData.title.trim() ||
          (formData.role === "client" ? "Client Account" : "Freelancer"),
      });

      // Redirect to profile completion onboarding page
      navigate("/complete-profile");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
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

        <h1 className="auth-heading">Join FreelanceHub</h1>
        <p className="auth-subheading">
          Create your account to start hiring exceptional talent or discovering client jobs.
        </p>

        {error && (
          <div className="auth-banner banner-danger">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form" noValidate>
          <div className="auth-field-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Alex Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field-group">
            <div className="field-label-row">
              <label htmlFor="password">Create Password *</label>
              <span className="field-hint">Min 6 characters</span>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field-group">
            <label htmlFor="role">I am joining as a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="client">Client (I want to post jobs and hire talent)</option>
              <option value="freelancer">Freelancer (I want to find projects and work)</option>
            </select>
          </div>

          <div className="auth-field-group">
            <label htmlFor="title">
              {formData.role === "client"
                ? "Company / Organization (Optional)"
                : "Professional Headline / Title"}
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder={
                formData.role === "client"
                  ? "e.g. Acme Innovations"
                  : "e.g. Senior Frontend Developer"
              }
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <label className="auth-checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>
              I agree to the <Link to="/help">Terms of Service</Link> and <Link to="/help">Privacy Policy</Link>
            </span>
          </label>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? "Creating Account..." : "Create Account & Setup Profile →"}
          </button>
        </form>

        <div className="auth-card-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-footer-link">
              Log In
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

export default Signup;