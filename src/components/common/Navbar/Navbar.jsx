import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const dashboardPath =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "freelancer"
      ? "/freelancer-dashboard"
      : "/client-dashboard";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "👤";

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            Freelance<span className="logo-accent">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <NavLink
            to="/find-work"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Find Work
          </NavLink>
          <NavLink
            to="/find-talent"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Find Talent
          </NavLink>
          <NavLink
            to="/blueprint"
            className={({ isActive }) => `nav-link ai-pill ${isActive ? "active" : ""}`}
          >
            ✨ AI Architect
          </NavLink>
          {user?.role !== "freelancer" && (
            <NavLink
              to="/post-job"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Post a Job
            </NavLink>
          )}
          <NavLink
            to="/calculator"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Calculator
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            About
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Help
          </NavLink>
          {user?.role === "admin" && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) => `nav-link admin-pill ${isActive ? "active" : ""}`}
            >
              👑 Admin Panel
            </NavLink>
          )}
        </div>

        {/* Action Buttons & Profile */}
        <div className="nav-actions">
          {user ? (
            <div className="nav-user-cluster">
              <Link to={dashboardPath} className="btn-dashboard">
                <span className="dashboard-icon">📊</span>
                <span className="dashboard-text">
                  {user.role === "admin"
                    ? "Admin"
                    : user.role === "client"
                    ? "Client"
                    : "Freelancer"}{" "}
                  Dashboard
                </span>
              </Link>

              <Link
                to="/complete-profile"
                state={{ isEditing: true }}
                className="user-profile-badge"
                title="Edit your profile"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-initials">{userInitials}</div>
                )}
                <div className="user-info-text">
                  <span className="user-display-name">{user.name}</span>
                  <span className="user-role-tag">{user.role}</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                title="Sign out of account"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="nav-guest-actions">
              <Link to="/login" className="btn-login">
                Log In
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <NavLink to="/find-work" onClick={closeMobileMenu} className="mobile-nav-link">
            💼 Find Work
          </NavLink>
          <NavLink to="/find-talent" onClick={closeMobileMenu} className="mobile-nav-link">
            🌟 Find Talent
          </NavLink>
          <NavLink to="/blueprint" onClick={closeMobileMenu} className="mobile-nav-link ai-highlight">
            ✨ AI Architect & Blueprint
          </NavLink>
          {user?.role !== "freelancer" && (
            <NavLink to="/post-job" onClick={closeMobileMenu} className="mobile-nav-link">
              📝 Post a Job
            </NavLink>
          )}
          <NavLink to="/calculator" onClick={closeMobileMenu} className="mobile-nav-link">
            🧮 Rate Calculator
          </NavLink>
          <NavLink to="/about" onClick={closeMobileMenu} className="mobile-nav-link">
            ℹ️ About Us
          </NavLink>
          <NavLink to="/help" onClick={closeMobileMenu} className="mobile-nav-link">
            ❓ Help Center
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin-dashboard" onClick={closeMobileMenu} className="mobile-nav-link admin-highlight">
              👑 Admin Dashboard
            </NavLink>
          )}

          <div className="mobile-drawer-footer">
            {user ? (
              <>
                <Link to={dashboardPath} onClick={closeMobileMenu} className="btn-primary-block">
                  Go to Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="btn-secondary-block">
                  Log Out
                </button>
              </>
            ) : (
              <div className="mobile-guest-buttons">
                <Link to="/login" onClick={closeMobileMenu} className="btn-secondary-block">
                  Log In
                </Link>
                <Link to="/signup" onClick={closeMobileMenu} className="btn-primary-block">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;