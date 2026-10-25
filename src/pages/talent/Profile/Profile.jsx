import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import { talentService } from "../../../services/talentService";
import { useAuth } from "../../../context/useAuth";
import HireModal from "../../../components/talent/HireModal/HireModal";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [imgError, setImgError] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    talentService.getFreelancerById(id).then((found) => {
      if (isMounted) {
        setPerson(found);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleHireClick = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: `Log in as a client to hire ${person.name}.`,
        },
      });
    } else if (user.role === "client") {
      setIsHireModalOpen(true);
    } else {
      showToast("Notice: You are currently logged in as a Freelancer. Only clients can hire talent.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="profile-loading-card">
            <div className="spinner"></div>
            <p>Loading professional profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!person) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="profile-not-found-card">
            <span className="not-found-icon">👤</span>
            <h2>Profile Not Found</h2>
            <p>The requested freelancer profile does not exist or has been removed.</p>
            <Link to="/find-talent" className="btn-back-talent">
              ← Return to Find Talent
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const skillsList = Array.isArray(person.skills)
    ? person.skills
    : typeof person.skills === "string"
    ? person.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rateDisplay = person.rate
    ? `₹${String(person.rate).replace(/[^0-9]/g, "")}`
    : "Negotiable";

  const isAvailable = person.availability
    ? person.availability.toLowerCase().includes("avail")
    : true;

  const fallbackInitial = person.name ? person.name.charAt(0).toUpperCase() : "F";

  return (
    <>
      <Navbar />

      <main className="profile-page">
        {toastMessage && (
          <div className="profile-toast-banner">
            <span>ℹ️ {toastMessage}</span>
            <button onClick={() => setToastMessage("")} aria-label="Close notification">
              ✕
            </button>
          </div>
        )}

        <div className="profile-container">
          <Link to="/find-talent" className="profile-back-link">
            ← Back to All Talent
          </Link>

          <div className="profile-layout-grid">
            {/* Main Column */}
            <div className="profile-main-col">
              {/* Profile Header Card */}
              <div className="profile-header-card">
                <div className="profile-avatar-wrapper">
                  {!imgError && person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      onError={() => setImgError(true)}
                      className="profile-avatar-large"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {fallbackInitial}
                    </div>
                  )}
                  <span
                    className={`profile-status-indicator ${
                      isAvailable ? "status-online" : "status-offline"
                    }`}
                    title={isAvailable ? "Available" : "Busy"}
                  ></span>
                </div>

                <div className="profile-primary-details">
                  <div className="profile-name-row">
                    <h1>{person.name}</h1>
                    <span className="profile-verified-badge" title="Verified Freelancer">
                      ✓ Verified
                    </span>
                  </div>

                  <p className="profile-headline">{person.role || person.primarySkill}</p>

                  <div className="profile-meta-tags">
                    <span className="meta-pill">📍 {person.distanceKm || 5} km away</span>
                    <span className="meta-pill">💼 {person.experience || "2 yrs"} experience</span>
                    <span className="meta-pill">🏆 {person.completedProjects || 0} projects completed</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="profile-section-card">
                <h2>About Me</h2>
                <p className="profile-bio-text">
                  {person.description ||
                    "Professional freelancer with proven expertise delivering high-quality work for clients."}
                </p>
              </div>

              {/* Skills Section */}
              <div className="profile-section-card">
                <h2>Skills & Expertise</h2>
                <div className="profile-skills-grid">
                  {skillsList.map((skill) => (
                    <span key={skill} className="profile-skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="profile-section-card">
                <h2>Performance Overview</h2>
                <div className="profile-stats-grid">
                  <div className="profile-stat-box">
                    <span className="stat-big">⭐ {person.rating || "5.0"}</span>
                    <span className="stat-sub">Client Rating</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="stat-big">{person.completedProjects || 0}</span>
                    <span className="stat-sub">Completed Jobs</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="stat-big">{person.earned || "₹50K+"}</span>
                    <span className="stat-sub">Total Earnings</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="stat-big">100%</span>
                    <span className="stat-sub">Job Success</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <aside className="profile-sidebar-col">
              <div className="profile-hire-card">
                <div className="hire-rate-header">
                  <span className="hire-rate-label">Hourly Rate</span>
                  <div className="hire-rate-price">
                    <strong>{rateDisplay}</strong>
                    <span className="price-unit">/ hour</span>
                  </div>
                </div>

                <div className="hire-availability-box">
                  <span className="avail-label">Availability</span>
                  <span
                    className={`avail-pill ${
                      isAvailable ? "pill-avail" : "pill-busy"
                    }`}
                  >
                    {person.availability || "Available now"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleHireClick}
                  className="btn-primary-hire"
                >
                  Hire {person.name} →
                </button>

                <div className="hire-guarantee-box">
                  <div className="guarantee-item">
                    <span className="guarantee-icon">🛡️</span>
                    <span>Payment Protected Escrow</span>
                  </div>
                  <div className="guarantee-item">
                    <span className="guarantee-icon">⚡</span>
                    <span>Fast Response Rate</span>
                  </div>
                  <div className="guarantee-item">
                    <span className="guarantee-icon">🔒</span>
                    <span>Satisfaction Guaranteed</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <HireModal
        freelancer={person}
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />

      <Footer />
    </>
  );
}

export default Profile;