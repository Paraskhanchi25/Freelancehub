import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import { useAuth } from "../../../context/useAuth";
import { proposalService } from "../../../services/proposalService";
import "./FreelancerDashboard.css";

function FreelancerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(() => location.state?.message || "");
  const [failedAvatar, setFailedAvatar] = useState(null);
  const showAvatar = Boolean(user?.avatar && failedAvatar !== user.avatar);

  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    proposalService
      .getProposals()
      .then((allProps) => {
        if (!isMounted) return;
        const myProps = allProps.filter(
          (p) =>
            (p.freelancerId && String(p.freelancerId) === String(user.id)) ||
            (p.freelancerEmail && p.freelancerEmail.toLowerCase() === user.email?.toLowerCase()) ||
            (p.freelancerName && p.freelancerName.toLowerCase() === user.name?.toLowerCase())
        );
        setProposals(myProps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading freelancer proposals:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3500);
  };

  // Withdraw proposal
  const handleWithdrawProposal = async (propId, jobTitle) => {
    if (!window.confirm(`Withdraw your application for "${jobTitle}"?`)) return;
    await proposalService.deleteProposal(propId);
    setProposals((prev) => prev.filter((p) => p.id !== propId));
    showToast(`Application for "${jobTitle}" withdrawn.`);
  };

  // Real active contracts (status === 'Hired' or 'Accepted')
  const activeContracts = proposals.filter(
    (p) => p.status === "Hired" || p.status === "Accepted"
  );

  const totalEarned = activeContracts.reduce((sum, c) => {
    const num = parseInt(String(c.bidAmount).replace(/[^0-9]/g, ""), 10) || 0;
    return sum + num;
  }, 0);

  // User initials avatar fallback
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FL";

  const skillsList = Array.isArray(user?.skills)
    ? user.skills
    : typeof user?.skills === "string"
    ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            {showAvatar ? (
              <img
                src={user.avatar}
                alt={user?.name || "Freelancer"}
                className="sidebar-avatar-img"
                onError={() => setFailedAvatar(user.avatar)}
              />
            ) : (
              <div className="sidebar-avatar-initials">{userInitials}</div>
            )}
            <div className="sidebar-profile-info">
              <h3>{user?.name || "Freelancer"}</h3>
              <p>{user?.title || "Freelancer"}</p>
              {user?.hourlyRate && (
                <span className="sidebar-rate-tag">₹{user.hourlyRate}/hr</span>
              )}
              <span className="sidebar-email">{user?.email}</span>

              <Link
                to="/complete-profile"
                state={{ isEditing: true }}
                className="btn-edit-profile-link"
              >
                ✏️ Edit Profile
              </Link>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={activeTab === "contracts" ? "active" : ""}
              onClick={() => setActiveTab("contracts")}
            >
              🚀 Active Projects ({activeContracts.length})
            </button>
            <button
              className={activeTab === "applied" ? "active" : ""}
              onClick={() => setActiveTab("applied")}
            >
              📋 Applied Jobs ({proposals.length})
            </button>
            <button
              className={activeTab === "earnings" ? "active" : ""}
              onClick={() => setActiveTab("earnings")}
            >
              💰 Earnings
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{ color: "#ef4444", marginTop: "12px" }}
            >
              🚪 Log Out
            </button>
          </nav>

          <Link to="/find-work" className="sidebar-cta">
            🔍 Browse Jobs
          </Link>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {toastMessage && (
            <div className="dashboard-toast">
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Profile Status Banner */}
          {!user?.profileCompleted ? (
            <div className="profile-alert-banner">
              <div>
                <strong>⚠️ Your freelancer profile is not fully complete!</strong>
                <p>Add your skills, hourly rate, bio, and profile photo so clients can discover and hire you in talent searches.</p>
              </div>
              <Link to="/complete-profile" className="btn-alert-action">
                Complete Profile →
              </Link>
            </div>
          ) : (
            <div className="profile-complete-banner">
              <span>✅ Your freelancer profile is active and visible in the talent directory.</span>
              <Link to="/complete-profile" state={{ isEditing: true }} className="profile-edit-text">
                Update Skills & Rate
              </Link>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Welcome back, {user?.name || "Freelancer"} 👋</h1>
                  <p className="dash-subtitle">Here is your freelancing pipeline and contract status.</p>
                </div>
                <Link to="/find-work" className="btn-primary" style={{ textDecoration: "none" }}>
                  🔍 Find New Projects
                </Link>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>{activeContracts.length}</span>
                  <p>Active Contracts</p>
                </div>
                <div className="stat-card">
                  <span>{proposals.length}</span>
                  <p>Applications Sent</p>
                </div>
                <div className="stat-card">
                  <span>₹{totalEarned.toLocaleString()}</span>
                  <p>Contract Value</p>
                </div>
                <div className="stat-card">
                  <span>{user?.hourlyRate ? `₹${user.hourlyRate}/hr` : "Set Rate"}</span>
                  <p>Current Hourly Rate</p>
                </div>
              </div>

              {/* Skills Card */}
              {skillsList.length > 0 && (
                <div className="profile-skills-widget">
                  <h3>Your Skills & Focus Areas</h3>
                  <div className="skills-tags-row">
                    {skillsList.map((skill) => (
                      <span key={skill} className="skill-chip-fl">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Contracts Summary */}
              <div className="section-title-row">
                <h2>Active Projects</h2>
                <Link to="/find-work" style={{ color: "#ff6b00", fontSize: "14px", fontWeight: "600" }}>
                  Browse More Jobs →
                </Link>
              </div>

              {loading ? (
                <div className="dashboard-empty">
                  <p>Loading your project status...</p>
                </div>
              ) : activeContracts.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Active Contracts Yet</h3>
                  <p>Apply to projects on the &quot;Find Work&quot; page. When a client hires you, your projects will appear here.</p>
                  <Link to="/find-work" className="btn-primary">
                    Browse Available Jobs
                  </Link>
                </div>
              ) : (
                <div className="contracts-list">
                  {activeContracts.map((c) => (
                    <div className="project-progress-card" key={c.id}>
                      <div className="project-progress-top">
                        <div>
                          <h3>{c.jobTitle}</h3>
                          <p>Client: {c.clientEmail || "Verified Client"}</p>
                          {c.estimatedDays && <small style={{ color: "#64748b" }}>Timeline: {c.estimatedDays}</small>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong style={{ fontSize: "18px", color: "#16a34a" }}>₹{c.bidAmount}</strong>
                          <span className="status-badge active" style={{ display: "block", marginTop: "4px" }}>
                            In Progress
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE PROJECTS */}
          {activeTab === "contracts" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Active Projects & Contracts</h1>
                  <p className="dash-subtitle">Projects where clients have hired you.</p>
                </div>
                <Link to="/find-work" className="btn-primary" style={{ textDecoration: "none" }}>
                  Find More Jobs
                </Link>
              </div>

              {activeContracts.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Active Projects</h3>
                  <p>Once a client accepts your proposal, the active project will appear here.</p>
                  <Link to="/find-work" className="btn-primary">
                    Browse Jobs & Submit Proposals
                  </Link>
                </div>
              ) : (
                <div className="contracts-list">
                  {activeContracts.map((c) => (
                    <div className="project-progress-card" key={c.id}>
                      <div className="project-progress-top">
                        <div>
                          <h3>{c.jobTitle}</h3>
                          <p>Client Contact: {c.clientEmail || "Client"}</p>
                          {c.estimatedDays && <p>Estimated Delivery: {c.estimatedDays}</p>}
                        </div>
                        <strong style={{ fontSize: "20px", color: "#0f172a" }}>₹{c.bidAmount}</strong>
                      </div>
                      <div className="contract-card-footer">
                        <span className="status-badge active">Contract Active</span>
                        <Link to={`/job-details/${c.jobId}`} style={{ color: "#ff6b00", fontSize: "13px", fontWeight: "600" }}>
                          View Job Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPLIED JOBS */}
          {activeTab === "applied" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Applied Jobs & Proposals</h1>
                  <p className="dash-subtitle">Track the status of your submitted job proposals.</p>
                </div>
                <Link to="/find-work" className="btn-primary" style={{ textDecoration: "none" }}>
                  + Apply to New Job
                </Link>
              </div>

              {proposals.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Applications Sent Yet</h3>
                  <p>You haven&apos;t submitted any proposals yet. Check out open opportunities and apply!</p>
                  <Link to="/find-work" className="btn-primary">
                    Explore Open Jobs
                  </Link>
                </div>
              ) : (
                <div className="dash-table">
                  <div className="dash-table-head">
                    <span>Job Title</span>
                    <span>Your Proposed Bid</span>
                    <span>Applied Date</span>
                    <span>Status</span>
                    <span className="actions-col">Action</span>
                  </div>
                  {proposals.map((prop) => (
                    <div className="dash-table-row" key={prop.id}>
                      <span>
                        <Link to={`/job-details/${prop.jobId}`} style={{ color: "#0f172a", fontWeight: "600" }}>
                          {prop.jobTitle}
                        </Link>
                      </span>
                      <span>₹{prop.bidAmount}</span>
                      <span>{new Date(prop.createdAt).toLocaleDateString()}</span>
                      <span>
                        <span
                          className={`status-badge ${
                            prop.status === "Hired"
                              ? "active"
                              : prop.status === "Shortlisted"
                              ? "active"
                              : prop.status === "Declined"
                              ? "closed"
                              : "pending"
                          }`}
                        >
                          {prop.status || "Under Review"}
                        </span>
                      </span>
                      <div className="actions-col">
                        {prop.status === "Under Review" ? (
                          <button
                            type="button"
                            className="btn-withdraw"
                            onClick={() => handleWithdrawProposal(prop.id, prop.jobTitle)}
                            title="Withdraw Application"
                          >
                            Withdraw
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EARNINGS */}
          {activeTab === "earnings" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Earnings & Payouts</h1>
                  <p className="dash-subtitle">Real-time revenue from your active and completed contracts.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>₹{totalEarned.toLocaleString()}</span>
                  <p>Total Contract Volume</p>
                </div>
                <div className="stat-card">
                  <span>{activeContracts.length}</span>
                  <p>Active Contracts</p>
                </div>
                <div className="stat-card">
                  <span>{user?.hourlyRate ? `₹${user.hourlyRate}/hr` : "₹0"}</span>
                  <p>Hourly Rate</p>
                </div>
              </div>

              {activeContracts.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Earnings Recorded Yet</h3>
                  <p>When clients hire you and approve contracts, your earnings history will appear here.</p>
                </div>
              ) : (
                <div className="dash-table" style={{ marginTop: "30px" }}>
                  <div className="dash-table-head">
                    <span>Project</span>
                    <span>Client Contact</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>
                  {activeContracts.map((c) => (
                    <div className="dash-table-row" key={c.id}>
                      <span>{c.jobTitle}</span>
                      <span>{c.clientEmail || "Client"}</span>
                      <span>₹{c.bidAmount}</span>
                      <span className="status-badge active">Secured in Escrow</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default FreelancerDashboard;
