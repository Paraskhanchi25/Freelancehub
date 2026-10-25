import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import { jobService } from "../../../services/jobService";
import { proposalService } from "../../../services/proposalService";
import { useAuth } from "../../../context/useAuth";
import "./ClientDashboard.css";

function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [postedJobs, setPostedJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(() => location.state?.message || "");
  const [failedAvatar, setFailedAvatar] = useState(null);
  const showAvatar = Boolean(user?.avatar && failedAvatar !== user.avatar);

  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    Promise.all([jobService.getJobs(), proposalService.getProposals()])
      .then(([allJobs, allProps]) => {
        if (!isMounted) return;
        const myJobs = allJobs.filter(
          (j) =>
            (j.clientId && String(j.clientId) === String(user.id)) ||
            (j.clientEmail && j.clientEmail.toLowerCase() === user.email?.toLowerCase()) ||
            (j.client && j.client.toLowerCase() === user.name?.toLowerCase())
        );
        setPostedJobs(myJobs);

        const jobIds = myJobs.map((j) => String(j.id));
        const myProps = allProps.filter(
          (p) =>
            (p.clientId && String(p.clientId) === String(user.id)) ||
            (p.clientEmail && p.clientEmail.toLowerCase() === user.email?.toLowerCase()) ||
            jobIds.includes(String(p.jobId))
        );
        setProposals(myProps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading client data:", err);
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

  // Toggle status (Active <-> Closed) - UPDATE
  const handleToggleStatus = async (job) => {
    const newStatus = job.status?.toLowerCase() === "active" ? "Closed" : "Active";
    await jobService.updateJob(job.id, { status: newStatus });
    setPostedJobs((prev) =>
      prev.map((j) => (String(j.id) === String(job.id) ? { ...j, status: newStatus } : j))
    );
    showToast(`Status for "${job.title}" updated to ${newStatus}`);
  };

  // Delete job - DELETE
  const handleDelete = async (jobId, jobTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobTitle}"? This cannot be undone.`
    );
    if (!confirmed) return;

    await jobService.deleteJob(jobId);
    setPostedJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));
    showToast(`Job "${jobTitle}" deleted successfully`);
  };

  // Proposal action handlers
  const handleUpdateProposalStatus = async (propId, newStatus, freelancerName) => {
    await proposalService.updateProposalStatus(propId, newStatus);
    setProposals((prev) =>
      prev.map((p) => (p.id === propId ? { ...p, status: newStatus } : p))
    );
    showToast(
      newStatus === "Hired"
        ? `🎉 Hired ${freelancerName}! Active contract started.`
        : `Proposal updated to: ${newStatus}`
    );
  };

  // Derived real data
  const hiredContracts = proposals.filter(
    (p) => p.status === "Hired" || p.status === "Accepted"
  );

  const activeJobsCount = postedJobs.filter(
    (j) => j.status?.toLowerCase() === "active"
  ).length;

  const totalCommittedBudget = hiredContracts.reduce((sum, contract) => {
    const num = parseInt(String(contract.bidAmount).replace(/[^0-9]/g, ""), 10) || 0;
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
    : "CL";

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
                alt={user?.name || "Client"}
                className="sidebar-avatar-img"
                onError={() => setFailedAvatar(user.avatar)}
              />
            ) : (
              <div className="sidebar-avatar-initials">{userInitials}</div>
            )}
            <div className="sidebar-profile-info">
              <h3>{user?.name || "Client User"}</h3>
              <p>{user?.company || "Independent Client"}</p>
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
              className={activeTab === "jobs" ? "active" : ""}
              onClick={() => setActiveTab("jobs")}
            >
              💼 My Posted Jobs ({postedJobs.length})
            </button>
            <button
              className={activeTab === "proposals" ? "active" : ""}
              onClick={() => setActiveTab("proposals")}
            >
              📄 Proposals Received ({proposals.length})
            </button>
            <button
              className={activeTab === "hired" ? "active" : ""}
              onClick={() => setActiveTab("hired")}
            >
              🤝 Hired & Contracts ({hiredContracts.length})
            </button>
            <button
              className={activeTab === "payments" ? "active" : ""}
              onClick={() => setActiveTab("payments")}
            >
              💳 Payments
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

          <Link to="/post-job" className="sidebar-cta">
            + Post a Job
          </Link>
        </aside>

        {/* Main Content Area */}
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

          {/* Profile Incomplete Notification Banner */}
          {!user?.profileCompleted ? (
            <div className="profile-alert-banner">
              <div>
                <strong>⚠️ Your profile is incomplete!</strong>
                <p>Add a profile photo, company details, and location to increase credibility with freelancers.</p>
              </div>
              <Link to="/complete-profile" className="btn-alert-action">
                Complete Profile Now →
              </Link>
            </div>
          ) : (
            <div className="profile-complete-banner">
              <span>✅ Your profile is complete and verified.</span>
              <Link to="/complete-profile" state={{ isEditing: true }} className="profile-edit-text">
                Edit Details
              </Link>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Welcome back, {user?.name || "Client"} 👋</h1>
                  <p className="dash-subtitle">
                    Real-time project pipeline and talent contracts.
                  </p>
                </div>
                <Link to="/post-job" className="btn-primary" style={{ textDecoration: "none" }}>
                  + Post a New Job
                </Link>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>{postedJobs.length}</span>
                  <p>Jobs Posted</p>
                </div>
                <div className="stat-card">
                  <span>{proposals.length}</span>
                  <p>Proposals Received</p>
                </div>
                <div className="stat-card">
                  <span>{activeJobsCount}</span>
                  <p>Active Job Listings</p>
                </div>
                <div className="stat-card">
                  <span>₹{totalCommittedBudget.toLocaleString()}</span>
                  <p>Committed Contracts</p>
                </div>
              </div>

              <div className="section-title-row">
                <h2>Active Job Postings</h2>
                <Link to="/find-work" style={{ color: "#ff6b00", fontSize: "14px", fontWeight: "600" }}>
                  Browse All Marketplace Jobs →
                </Link>
              </div>

              {loading ? (
                <div className="dashboard-empty">
                  <p>Loading your client data...</p>
                </div>
              ) : postedJobs.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Jobs Posted Yet</h3>
                  <p>Post a project today to start receiving proposals from qualified professionals.</p>
                  <Link to="/post-job" className="btn-primary">
                    + Post Your First Job
                  </Link>
                </div>
              ) : (
                <div className="dash-table">
                  <div className="dash-table-head">
                    <span>Job Title</span>
                    <span>Budget</span>
                    <span>Proposals</span>
                    <span>Status</span>
                    <span className="actions-col">Actions</span>
                  </div>
                  {postedJobs.map((job) => {
                    const isActive = job.status?.toLowerCase() === "active";
                    return (
                      <div className="dash-table-row" key={job.id}>
                        <span>
                          <strong>{job.title}</strong>
                          {job.category && (
                            <small style={{ display: "block", color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                              {job.category}
                            </small>
                          )}
                        </span>
                        <span>₹{job.budget}</span>
                        <span>{job.proposals || 0}</span>
                        <span>
                          <span className={`status-badge ${isActive ? "active" : "closed"}`}>
                            {job.status || "Active"}
                          </span>
                        </span>
                        <div className="actions-col">
                          <Link to={`/blueprint?jobId=${job.id}`} className="action-btn blueprint" title="⚡ Generate AI Architecture & Blueprint">
                            ⚡
                          </Link>
                          <Link to={`/job-details/${job.id}`} className="action-btn view" title="View Job Details">
                            👁️
                          </Link>
                          <Link to={`/edit-job/${job.id}`} className="action-btn edit" title="Edit Job">
                            ✏️
                          </Link>
                          <button
                            type="button"
                            className="action-btn toggle"
                            onClick={() => handleToggleStatus(job)}
                            title={`Toggle to ${isActive ? "Closed" : "Active"}`}
                          >
                            🔄
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(job.id, job.title)}
                            title="Delete Job"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY POSTED JOBS */}
          {activeTab === "jobs" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>My Job Postings</h1>
                  <p className="dash-subtitle">
                    Manage your job listings, edit parameters, or close vacancies.
                  </p>
                </div>
                <Link to="/post-job" className="btn-primary" style={{ textDecoration: "none" }}>
                  + Post a Job
                </Link>
              </div>

              {postedJobs.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Jobs Posted Yet</h3>
                  <p>Ready to hire? Create your first job listing now.</p>
                  <Link to="/post-job" className="btn-primary">
                    + Post a Job
                  </Link>
                </div>
              ) : (
                <div className="dash-table">
                  <div className="dash-table-head">
                    <span>Job Title</span>
                    <span>Budget</span>
                    <span>Proposals</span>
                    <span>Status</span>
                    <span className="actions-col">Actions</span>
                  </div>
                  {postedJobs.map((job) => {
                    const isActive = job.status?.toLowerCase() === "active";
                    return (
                      <div className="dash-table-row" key={job.id}>
                        <span>
                          <strong>{job.title}</strong>
                          <small style={{ display: "block", color: "#64748b", fontSize: "12px" }}>
                            {job.category}
                          </small>
                        </span>
                        <span>₹{job.budget}</span>
                        <span>{job.proposals || 0}</span>
                        <span>
                          <span className={`status-badge ${isActive ? "active" : "closed"}`}>
                            {job.status || "Active"}
                          </span>
                        </span>
                        <div className="actions-col">
                          <Link to={`/blueprint?jobId=${job.id}`} className="action-btn blueprint" title="⚡ Generate AI Architecture & Blueprint">
                            ⚡
                          </Link>
                          <Link to={`/job-details/${job.id}`} className="action-btn view" title="View Details">
                            👁️
                          </Link>
                          <Link to={`/edit-job/${job.id}`} className="action-btn edit" title="Edit Job">
                            ✏️
                          </Link>
                          <button
                            type="button"
                            className="action-btn toggle"
                            onClick={() => handleToggleStatus(job)}
                            title="Toggle Status"
                          >
                            🔄
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(job.id, job.title)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROPOSALS RECEIVED */}
          {activeTab === "proposals" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Proposals Received</h1>
                  <p className="dash-subtitle">
                    Review pitches and bids submitted by freelancers for your projects.
                  </p>
                </div>
              </div>

              {proposals.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Proposals Received Yet</h3>
                  <p>When freelancers apply to your job postings, their bids and cover letters will appear here.</p>
                </div>
              ) : (
                <div className="proposals-list">
                  {proposals.map((prop) => (
                    <div className="proposal-card" key={prop.id}>
                      <div className="proposal-card-header">
                        <div className="prop-freelancer-info">
                          {prop.freelancerAvatar ? (
                            <img src={prop.freelancerAvatar} alt={prop.freelancerName} className="prop-avatar" />
                          ) : (
                            <div className="prop-avatar-initials">
                              {prop.freelancerName?.[0] || "F"}
                            </div>
                          )}
                          <div>
                            <h3>{prop.freelancerName}</h3>
                            <p className="prop-role">{prop.freelancerRole || "Freelancer"}</p>
                            <small className="prop-job-title">Applied for: <strong>{prop.jobTitle}</strong></small>
                          </div>
                        </div>

                        <div className="prop-bid-box">
                          <span className="prop-bid-label">Proposed Bid</span>
                          <strong className="prop-bid-amount">₹{prop.bidAmount}</strong>
                          {prop.estimatedDays && (
                            <small className="prop-delivery">Est: {prop.estimatedDays}</small>
                          )}
                        </div>
                      </div>

                      <div className="proposal-body">
                        <p className="prop-cover-letter">{prop.coverLetter}</p>
                      </div>

                      <div className="proposal-footer">
                        <span className={`status-badge ${prop.status === "Hired" ? "active" : prop.status === "Declined" ? "closed" : "pending"}`}>
                          {prop.status || "Under Review"}
                        </span>

                        <div className="proposal-actions">
                          {prop.status === "Hired" && (
                            <span className="contract-active-pill">✓ Contract Active</span>
                          )}

                          {prop.status === "Declined" && (
                            <span className="proposal-declined-pill">✕ Application Declined</span>
                          )}

                          {prop.status !== "Hired" && prop.status !== "Declined" && (
                            <>
                              <button
                                type="button"
                                className="btn-hire-now"
                                onClick={() => handleUpdateProposalStatus(prop.id, "Hired", prop.freelancerName)}
                              >
                                🤝 Hire & Start Contract
                              </button>

                              {prop.status !== "Shortlisted" && (
                                <button
                                  type="button"
                                  className="btn-shortlist"
                                  onClick={() => handleUpdateProposalStatus(prop.id, "Shortlisted", prop.freelancerName)}
                                >
                                  ⭐ Shortlist
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-decline"
                                onClick={() => handleUpdateProposalStatus(prop.id, "Declined", prop.freelancerName)}
                              >
                                ✕ Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HIRED FREELANCERS / CONTRACTS */}
          {activeTab === "hired" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Hired Freelancers & Contracts</h1>
                  <p className="dash-subtitle">
                    Manage ongoing contracts and completed milestones.
                  </p>
                </div>
              </div>

              {hiredContracts.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Active Hires Yet</h3>
                  <p>Review candidate proposals in the &quot;Proposals Received&quot; tab and click &quot;Hire&quot; to begin a contract.</p>
                </div>
              ) : (
                <div className="hired-grid">
                  {hiredContracts.map((contract) => (
                    <div className="hired-card" key={contract.id}>
                      {contract.freelancerAvatar ? (
                        <img src={contract.freelancerAvatar} alt={contract.freelancerName} />
                      ) : (
                        <div className="hired-avatar-placeholder">
                          {contract.freelancerName?.[0] || "F"}
                        </div>
                      )}
                      <div className="hired-details">
                        <h3>{contract.freelancerName}</h3>
                        <p className="hired-role">{contract.freelancerRole}</p>
                        <p className="hired-project">Project: <strong>{contract.jobTitle}</strong></p>
                        <p className="hired-agreed-budget">Agreed Rate: <strong>₹{contract.bidAmount}</strong></p>
                        <span className="status-badge active">Active Contract</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAYMENTS */}
          {activeTab === "payments" && (
            <div>
              <div className="dash-heading-row">
                <div>
                  <h1>Payment History & Escrow</h1>
                  <p className="dash-subtitle">
                    Financial records for your active and completed contracts.
                  </p>
                </div>
              </div>

              {hiredContracts.length === 0 ? (
                <div className="dashboard-empty">
                  <h3>No Payment Activity</h3>
                  <p>When you hire freelancers, payment and invoice schedules appear here.</p>
                </div>
              ) : (
                <div className="dash-table">
                  <div className="dash-table-head">
                    <span>Freelancer</span>
                    <span>Project</span>
                    <span>Amount</span>
                    <span>Date</span>
                    <span>Payment Status</span>
                  </div>
                  {hiredContracts.map((contract) => (
                    <div className="dash-table-row" key={contract.id}>
                      <span>{contract.freelancerName}</span>
                      <span>{contract.jobTitle}</span>
                      <span>₹{contract.bidAmount}</span>
                      <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
                      <span className="status-badge active">Funds Secured</span>
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

export default ClientDashboard;
