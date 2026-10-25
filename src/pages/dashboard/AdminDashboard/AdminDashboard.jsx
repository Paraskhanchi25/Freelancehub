import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import { useAuth } from "../../../context/useAuth";
import { authService } from "../../../services/authService";
import { jobService } from "../../../services/jobService";
import { proposalService } from "../../../services/proposalService";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(() => location.state?.message || "");

  // Filters & Search
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("all");

  const [proposalSearch, setProposalSearch] = useState("");
  const [proposalStatusFilter, setProposalStatusFilter] = useState("all");

  // Create User Modal state
  const [showAddUser, setShowAddUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "client",
    title: "",
    hourlyRate: "",
  });

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Centralized data loader
  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [u, j, p] = await Promise.all([
        authService.getUsers(),
        jobService.getJobs(),
        proposalService.getProposals(),
      ]);
      setUsers(u || []);
      setJobs(j || []);
      setProposals(p || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showNotification("Failed to refresh data: " + err.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      authService.getUsers(),
      jobService.getJobs(),
      proposalService.getProposals(),
    ])
      .then(([u, j, p]) => {
        if (!isMounted) return;
        setUsers(u || []);
        setJobs(j || []);
        setProposals(p || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admin data on mount:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // User Management Handlers
  const handleToggleUserStatus = async (targetUser) => {
    const newStatus = targetUser.status === "Suspended" ? "Active" : "Suspended";
    try {
      await authService.updateUser(targetUser.id, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: newStatus } : u))
      );
      showNotification(`User ${targetUser.name} marked as ${newStatus}`);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await authService.updateUser(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showNotification(`User role updated to ${newRole}`);
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Permanently delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await authService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showNotification(`User "${userName}" deleted successfully`);
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      await authService.signup(newUserData);
      showNotification(`User "${newUserData.name}" created successfully!`);
      setShowAddUser(false);
      setNewUserData({
        name: "",
        email: "",
        password: "password123",
        role: "client",
        title: "",
        hourlyRate: "",
      });
      await loadData();
    } catch (err) {
      alert("Error creating user: " + err.message);
    } finally {
      setCreatingUser(false);
    }
  };

  // Job Moderation Handlers
  const handleToggleJobStatus = async (job) => {
    const newStatus = job.status?.toLowerCase() === "active" ? "Closed" : "Active";
    try {
      await jobService.updateJob(job.id, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
      );
      showNotification(`Job "${job.title}" marked as ${newStatus}`);
    } catch (err) {
      alert("Failed to update job status: " + err.message);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Permanently delete job "${jobTitle}"?`)) return;
    try {
      await jobService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      showNotification(`Job "${jobTitle}" removed`);
    } catch (err) {
      alert("Failed to delete job: " + err.message);
    }
  };

  // Proposal Moderation Handlers
  const handleUpdateProposalStatus = async (propId, newStatus) => {
    try {
      await proposalService.updateProposalStatus(propId, newStatus);
      setProposals((prev) =>
        prev.map((p) => (p.id === propId ? { ...p, status: newStatus } : p))
      );
      showNotification(`Proposal status updated to "${newStatus}"`);
    } catch (err) {
      alert("Failed to update proposal: " + err.message);
    }
  };

  const handleDeleteProposal = async (proposalId) => {
    if (!window.confirm("Permanently delete this proposal?")) return;
    try {
      await proposalService.deleteProposal(proposalId);
      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
      showNotification("Proposal removed successfully");
    } catch (err) {
      alert("Failed to delete proposal: " + err.message);
    }
  };

  // Export platform data snapshot as JSON
  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      platform: "FreelanceHub",
      totalUsers: users.length,
      totalJobs: jobs.length,
      totalProposals: proposals.length,
      users,
      jobs,
      proposals,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freelancehub-admin-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Platform data exported successfully!");
  };

  // Core Metrics Calculations
  const totalClients = users.filter((u) => u.role === "client").length;
  const totalFreelancers = users.filter((u) => u.role === "freelancer").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const activeJobs = jobs.filter((j) => j.status?.toLowerCase() === "active").length;

  const totalGrossPipeline = jobs.reduce((sum, j) => {
    const n = parseInt(String(j.budget).replace(/[^0-9]/g, ""), 10) || 0;
    return sum + n;
  }, 0);

  const hiredProposals = proposals.filter((p) => p.status === "Hired");
  const totalHiredContractValue = hiredProposals.reduce((sum, p) => {
    const n = parseInt(String(p.bidAmount).replace(/[^0-9]/g, ""), 10) || 0;
    return sum + n;
  }, 0);

  const platformFee = Math.round(totalHiredContractValue * 0.1); // 10% FreelanceHub Platform Fee
  const freelancerPayouts = totalHiredContractValue - platformFee;

  // Filtered views
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !userSearch.trim() ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.title?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole =
      userRoleFilter === "all" ? true : u.role === userRoleFilter;
    const matchesStatus =
      userStatusFilter === "all"
        ? true
        : userStatusFilter === "active"
        ? u.status !== "Suspended"
        : u.status === "Suspended";
    return matchesSearch && matchesRole && matchesStatus;
  });

  const categories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean)));

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      !jobSearch.trim() ||
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.client?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.description?.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus =
      jobStatusFilter === "all"
        ? true
        : j.status?.toLowerCase() === jobStatusFilter.toLowerCase();
    const matchesCat =
      jobCategoryFilter === "all" ? true : j.category === jobCategoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      !proposalSearch.trim() ||
      p.jobTitle?.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      p.freelancerName?.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      p.coverLetter?.toLowerCase().includes(proposalSearch.toLowerCase());
    const matchesStatus =
      proposalStatusFilter === "all" ? true : p.status === proposalStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic Activity Trail
  const recentActivities = [
    ...users.map((u) => ({
      id: `usr-${u.id}`,
      type: "user",
      icon: "👤",
      title: `New user joined: ${u.name}`,
      meta: `${u.role.toUpperCase()} • ${u.email}`,
      time: u.createdAt || "Recent",
      rawDate: new Date(u.createdAt || 0).getTime(),
    })),
    ...jobs.map((j) => ({
      id: `job-${j.id}`,
      type: "job",
      icon: "💼",
      title: `Job posted: "${j.title}"`,
      meta: `By ${j.client || "Client"} • ₹${j.budget}`,
      time: j.createdAt || j.posted || "Recent",
      rawDate: new Date(j.createdAt || 0).getTime(),
    })),
    ...proposals.map((p) => ({
      id: `prop-${p.id}`,
      type: "proposal",
      icon: p.status === "Hired" ? "🎉" : "📄",
      title: `${p.status === "Hired" ? "Contract started" : "Proposal submitted"}: ${p.freelancerName}`,
      meta: `For "${p.jobTitle}" • ₹${p.bidAmount} (${p.status})`,
      time: p.createdAt || "Recent",
      rawDate: new Date(p.createdAt || 0).getTime(),
    })),
  ].sort((a, b) => b.rawDate - a.rawDate).slice(0, 15);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "80px 20px", textAlign: "center", color: "#64748b" }}>
          <h2>Loading Admin Command Center...</h2>
          <p>Gathering platform metrics, users, and marketplace activity.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-badge">
            <div className="admin-avatar">👑</div>
            <h3>{user?.name || "Administrator"}</h3>
            <span className="role-tag">Super Administrator</span>
            <small>{user?.email}</small>
          </div>

          {/* Quick View Switcher for Owners */}
          <div className="admin-preview-switcher">
            <span className="switcher-label">Switch View:</span>
            <div className="switcher-buttons">
              <button
                type="button"
                className="btn-switch-pill active"
                title="Current View: Admin Dashboard"
              >
                👑 Admin
              </button>
              <button
                type="button"
                className="btn-switch-pill"
                onClick={() => navigate("/client-dashboard")}
                title="Switch to Client Dashboard"
              >
                💼 Client
              </button>
              <button
                type="button"
                className="btn-switch-pill"
                onClick={() => navigate("/freelancer-dashboard")}
                title="Switch to Freelancer Dashboard"
              >
                💻 Freelancer
              </button>
            </div>
          </div>

          <nav className="admin-nav">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              📊 System Overview
            </button>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              👥 User Management ({users.length})
            </button>
            <button
              className={activeTab === "jobs" ? "active" : ""}
              onClick={() => setActiveTab("jobs")}
            >
              💼 Jobs Moderation ({jobs.length})
            </button>
            <button
              className={activeTab === "proposals" ? "active" : ""}
              onClick={() => setActiveTab("proposals")}
            >
              📄 Proposals & Bids ({proposals.length})
            </button>
            <button
              className={activeTab === "financials" ? "active" : ""}
              onClick={() => setActiveTab("financials")}
            >
              💰 Revenue & Escrow
            </button>
            <button
              className={activeTab === "audit" ? "active" : ""}
              onClick={() => setActiveTab("audit")}
            >
              📜 Activity Audit Log
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{ color: "#ef4444", marginTop: "15px" }}
            >
              🚪 Log Out
            </button>
          </nav>

          <div className="admin-quick-links">
            <button
              type="button"
              className="btn-export-link"
              onClick={handleExportData}
              title="Download full JSON backup of the database"
            >
              📥 Export Platform Data
            </button>
            <Link to="/find-work" className="admin-link-btn">
              🔍 View Live Jobs Feed
            </Link>
            <Link to="/find-talent" className="admin-link-btn">
              🌟 View Live Talent Feed
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {toast && (
            <div className="admin-toast">
              <span>{toast}</span>
              <button onClick={() => setToast("")}>✕</button>
            </div>
          )}

          {/* TAB 1: SYSTEM OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h1>FreelanceHub Command Center</h1>
                  <p>Real-time platform metrics, active contracts, and volume.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn-refresh"
                    onClick={loadData}
                    disabled={refreshing}
                  >
                    🔄 {refreshing ? "Refreshing..." : "Refresh Data"}
                  </button>
                  <button
                    className="btn-primary-admin"
                    onClick={() => setShowAddUser(true)}
                  >
                    + Add User
                  </button>
                </div>
              </div>

              {/* Top Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-header">
                    <span>👥 Total Users</span>
                    <span className="stat-badge green">Live</span>
                  </div>
                  <span className="stat-number">{users.length}</span>
                  <small>
                    {totalClients} Clients • {totalFreelancers} Freelancers • {totalAdmins} Admins
                  </small>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-header">
                    <span>💼 Active Jobs</span>
                    <span className="stat-badge orange">Open</span>
                  </div>
                  <span className="stat-number">{activeJobs}</span>
                  <small>{jobs.length} Total Postings on Record</small>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-header">
                    <span>📄 Bids & Proposals</span>
                    <span className="stat-badge blue">Submissions</span>
                  </div>
                  <span className="stat-number">{proposals.length}</span>
                  <small>
                    {hiredProposals.length} Active / Completed Contracts
                  </small>
                </div>

                <div className="admin-stat-card highlight">
                  <div className="stat-card-header">
                    <span>💰 Platform Revenue</span>
                    <span className="stat-badge purple">10% Cut</span>
                  </div>
                  <span className="stat-number">₹{platformFee.toLocaleString()}</span>
                  <small>From ₹{totalHiredContractValue.toLocaleString()} settled contracts</small>
                </div>
              </div>

              {/* Pipeline Volume Callout */}
              <div className="admin-pipeline-banner">
                <div>
                  <h3>Total Platform Pipeline: ₹{totalGrossPipeline.toLocaleString()}</h3>
                  <p>Sum of budgets across all active and open client projects.</p>
                </div>
                <div className="banner-actions">
                  <button onClick={() => setActiveTab("financials")} className="btn-banner-link">
                    View Financial Details →
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Recent Jobs & Recent Users */}
              <div className="admin-overview-grid">
                {/* Recent Jobs */}
                <div className="admin-card-section">
                  <div className="card-section-title">
                    <h2>Recent Job Listings</h2>
                    <button className="link-subtle" onClick={() => setActiveTab("jobs")}>
                      View All ({jobs.length}) →
                    </button>
                  </div>
                  <div className="admin-table">
                    <div className="admin-th">
                      <span>Job Title</span>
                      <span>Client</span>
                      <span>Budget</span>
                      <span>Status</span>
                    </div>
                    {jobs.slice(0, 5).map((j) => (
                      <div className="admin-tr" key={j.id}>
                        <span>
                          <Link to={`/job-details/${j.id}`} className="table-link">
                            {j.title}
                          </Link>
                          <small style={{ display: "block", color: "#64748b" }}>{j.category}</small>
                        </span>
                        <span>{j.client || "Client"}</span>
                        <span>₹{j.budget}</span>
                        <span>
                          <button
                            className={`status-btn-toggle ${j.status?.toLowerCase() === "active" ? "active" : "suspended"}`}
                            onClick={() => handleToggleJobStatus(j)}
                            title="Click to toggle status"
                          >
                            {j.status || "Active"}
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="admin-card-section">
                  <div className="card-section-title">
                    <h2>Recent Registrations</h2>
                    <button className="link-subtle" onClick={() => setActiveTab("users")}>
                      View All ({users.length}) →
                    </button>
                  </div>
                  <div className="admin-table">
                    <div className="admin-th">
                      <span>User</span>
                      <span>Role</span>
                      <span>Status</span>
                      <span>Action</span>
                    </div>
                    {users.slice(0, 5).map((u) => (
                      <div className="admin-tr" key={u.id}>
                        <span>
                          <strong>{u.name}</strong>
                          <small style={{ display: "block", color: "#64748b" }}>{u.email}</small>
                        </span>
                        <span>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </span>
                        <span>
                          <button
                            className={`status-btn-toggle ${u.status === "Suspended" ? "suspended" : "active"}`}
                            onClick={() => handleToggleUserStatus(u)}
                          >
                            {u.status || "Active"}
                          </button>
                        </span>
                        <span>
                          <button
                            className="btn-admin-delete-mini"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h1>User Management ({users.length})</h1>
                  <p>Control roles, account suspension states, and user access.</p>
                </div>
                <button
                  className="btn-primary-admin"
                  onClick={() => setShowAddUser(true)}
                >
                  + Add New User
                </button>
              </div>

              {/* Filters */}
              <div className="admin-filter-bar">
                <input
                  type="text"
                  placeholder="Search by name, email, or title..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="admin-search-input"
                />

                <div className="admin-filter-pills">
                  {["all", "client", "freelancer", "admin"].map((r) => (
                    <button
                      key={r}
                      className={userRoleFilter === r ? "active" : ""}
                      onClick={() => setUserRoleFilter(r)}
                    >
                      {r.toUpperCase()} (
                      {r === "all" ? users.length : users.filter((u) => u.role === r).length}
                      )
                    </button>
                  ))}
                </div>

                <div className="admin-filter-pills">
                  {["all", "active", "suspended"].map((st) => (
                    <button
                      key={st}
                      className={userStatusFilter === st ? "active" : ""}
                      onClick={() => setUserStatusFilter(st)}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-table">
                <div className="admin-th">
                  <span>User Details</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span style={{ textAlign: "right" }}>Actions</span>
                </div>
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    No users match your search criteria.
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div className="admin-tr" key={u.id}>
                      <span>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: "#e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "#475569",
                              }}
                            >
                              {u.name ? u.name[0] : "U"}
                            </div>
                          )}
                          <div>
                            <strong>{u.name}</strong>
                            <small style={{ display: "block", color: "#64748b" }}>
                              {u.title || u.company || (u.role === "admin" ? "Platform Admin" : "Independent")}
                            </small>
                          </div>
                        </div>
                      </span>
                      <span>{u.email}</span>
                      <span>
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="client">Client</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </span>
                      <span>
                        <button
                          className={`status-btn-toggle ${u.status === "Suspended" ? "suspended" : "active"}`}
                          onClick={() => handleToggleUserStatus(u)}
                          title="Click to toggle status"
                        >
                          {u.status || "Active"}
                        </button>
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <button
                          className="btn-admin-delete"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Permanently Delete User"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: JOBS MODERATION */}
          {activeTab === "jobs" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h1>Jobs Moderation ({jobs.length})</h1>
                  <p>Moderate postings, toggle open/closed states, or remove spam.</p>
                </div>
                <Link to="/post-job" className="btn-primary-admin">
                  + Create New Job
                </Link>
              </div>

              {/* Search & Category Filter */}
              <div className="admin-filter-bar">
                <input
                  type="text"
                  placeholder="Search jobs by title, client, or keyword..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="admin-search-input"
                />

                <div className="admin-filter-pills">
                  {["all", "active", "closed"].map((st) => (
                    <button
                      key={st}
                      className={jobStatusFilter === st ? "active" : ""}
                      onClick={() => setJobStatusFilter(st)}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>

                {categories.length > 0 && (
                  <select
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                    className="role-select"
                    style={{ width: "auto" }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="admin-table">
                <div className="admin-th">
                  <span>Job Details</span>
                  <span>Client / Posted By</span>
                  <span>Budget</span>
                  <span>Proposals</span>
                  <span>Status</span>
                  <span style={{ textAlign: "right" }}>Actions</span>
                </div>
                {filteredJobs.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    No jobs found matching your filters.
                  </div>
                ) : (
                  filteredJobs.map((j) => (
                    <div className="admin-tr" key={j.id}>
                      <span>
                        <Link to={`/job-details/${j.id}`} className="table-link">
                          {j.title}
                        </Link>
                        <small style={{ display: "block", color: "#64748b" }}>
                          {j.category} • Posted: {j.posted || "Recently"}
                        </small>
                      </span>
                      <span>
                        <strong>{j.client || "Client"}</strong>
                        <small style={{ display: "block", color: "#64748b" }}>{j.clientEmail || ""}</small>
                      </span>
                      <span>
                        <strong style={{ color: "#0f172a" }}>₹{j.budget}</strong>
                      </span>
                      <span>{j.proposals || 0} bids</span>
                      <span>
                        <button
                          className={`status-btn-toggle ${j.status?.toLowerCase() === "active" ? "active" : "suspended"}`}
                          onClick={() => handleToggleJobStatus(j)}
                        >
                          {j.status || "Active"}
                        </button>
                      </span>
                      <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        <Link to={`/edit-job/${j.id}`} className="btn-admin-edit">
                          ✏️ Edit
                        </Link>
                        <button
                          className="btn-admin-delete"
                          onClick={() => handleDeleteJob(j.id, j.title)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PROPOSALS & BIDS */}
          {activeTab === "proposals" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h1>Proposals & Bids ({proposals.length})</h1>
                  <p>All bids submitted by freelancers across all client projects.</p>
                </div>
              </div>

              <div className="admin-filter-bar">
                <input
                  type="text"
                  placeholder="Search by project, freelancer, or proposal pitch..."
                  value={proposalSearch}
                  onChange={(e) => setProposalSearch(e.target.value)}
                  className="admin-search-input"
                />

                <div className="admin-filter-pills">
                  {["all", "Under Review", "Shortlisted", "Hired", "Declined"].map((st) => (
                    <button
                      key={st}
                      className={proposalStatusFilter === st ? "active" : ""}
                      onClick={() => setProposalStatusFilter(st)}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-table">
                <div className="admin-th">
                  <span>Project & Freelancer</span>
                  <span>Bid Amount</span>
                  <span>Timeline</span>
                  <span>Proposal Cover Letter</span>
                  <span>Status</span>
                  <span style={{ textAlign: "right" }}>Actions</span>
                </div>
                {filteredProposals.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                    No proposals found matching your search.
                  </div>
                ) : (
                  filteredProposals.map((p) => (
                    <div className="admin-tr" key={p.id}>
                      <span>
                        <Link to={`/job-details/${p.jobId}`} className="table-link">
                          {p.jobTitle || `Job #${p.jobId}`}
                        </Link>
                        <small style={{ display: "block", color: "#64748b" }}>
                          Bidder: <strong>{p.freelancerName}</strong> ({p.freelancerEmail})
                        </small>
                      </span>
                      <span>
                        <strong style={{ color: "#16a34a" }}>₹{p.bidAmount}</strong>
                      </span>
                      <span>{p.estimatedDays || "N/A"}</span>
                      <span style={{ fontSize: "12px", color: "#475569", maxWidth: "260px" }}>
                        {p.coverLetter}
                      </span>
                      <span>
                        <select
                          value={p.status || "Under Review"}
                          onChange={(e) => handleUpdateProposalStatus(p.id, e.target.value)}
                          className="role-select"
                          style={{
                            background:
                              p.status === "Hired"
                                ? "#dcfce7"
                                : p.status === "Shortlisted"
                                ? "#e0f2fe"
                                : p.status === "Declined"
                                ? "#fee2e2"
                                : "#fff",
                            fontWeight: "600",
                          }}
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Hired">Hired (Contract)</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <button
                          className="btn-admin-delete"
                          onClick={() => handleDeleteProposal(p.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIALS & REVENUE */}
          {activeTab === "financials" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h1>Platform Financials & Revenue</h1>
                  <p>Escrow balances, commission metrics, and contract disbursements.</p>
                </div>
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card highlight">
                  <div className="stat-card-header">
                    <span>🏦 Settled Contract Volume</span>
                  </div>
                  <span className="stat-number">₹{totalHiredContractValue.toLocaleString()}</span>
                  <small>Across {hiredProposals.length} finalized agreements</small>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-header">
                    <span>👑 FreelanceHub Platform Fee (10%)</span>
                  </div>
                  <span className="stat-number" style={{ color: "#ff6b00" }}>
                    ₹{platformFee.toLocaleString()}
                  </span>
                  <small>Platform operating revenue</small>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-header">
                    <span>💼 Freelancer Payouts (90%)</span>
                  </div>
                  <span className="stat-number" style={{ color: "#16a34a" }}>
                    ₹{freelancerPayouts.toLocaleString()}
                  </span>
                  <small>Disbursed to talent</small>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-header">
                    <span>📈 Gross Open Pipeline</span>
                  </div>
                  <span className="stat-number">₹{totalGrossPipeline.toLocaleString()}</span>
                  <small>All open job budgets combined</small>
                </div>
              </div>

              {/* Contracts Breakdown Table */}
              <div className="admin-card-section" style={{ marginTop: "24px" }}>
                <h2>Active & Settled Contracts</h2>
                <div className="admin-table">
                  <div className="admin-th">
                    <span>Project</span>
                    <span>Freelancer</span>
                    <span>Client</span>
                    <span>Agreed Contract</span>
                    <span>Platform Cut (10%)</span>
                    <span>Talent Payout (90%)</span>
                    <span>Status</span>
                  </div>
                  {hiredProposals.length === 0 ? (
                    <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                      No active contracts currently established.
                    </div>
                  ) : (
                    hiredProposals.map((hp) => {
                      const amount = parseInt(String(hp.bidAmount).replace(/[^0-9]/g, ""), 10) || 0;
                      const fee = Math.round(amount * 0.1);
                      const payout = amount - fee;
                      return (
                        <div className="admin-tr" key={hp.id}>
                          <span>
                            <Link to={`/job-details/${hp.jobId}`} className="table-link">
                              {hp.jobTitle}
                            </Link>
                          </span>
                          <span>
                            <strong>{hp.freelancerName}</strong>
                          </span>
                          <span>{hp.clientEmail || "Client"}</span>
                          <span>
                            <strong>₹{amount.toLocaleString()}</strong>
                          </span>
                          <span style={{ color: "#ff6b00", fontWeight: "600" }}>
                            ₹{fee.toLocaleString()}
                          </span>
                          <span style={{ color: "#16a34a", fontWeight: "600" }}>
                            ₹{payout.toLocaleString()}
                          </span>
                          <span>
                            <span className="status-pill active">In Progress</span>
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === "audit" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <h1>System Activity Audit Log</h1>
                  <p>Real-time chronicle of user registrations, job postings, and contract milestones.</p>
                </div>
                <button className="btn-refresh" onClick={loadData}>
                  🔄 Refresh Log
                </button>
              </div>

              <div className="admin-card-section">
                <div className="admin-audit-list">
                  {recentActivities.map((act) => (
                    <div className="admin-audit-item" key={act.id}>
                      <div className="audit-icon">{act.icon}</div>
                      <div className="audit-content">
                        <strong>{act.title}</strong>
                        <p>{act.meta}</p>
                      </div>
                      <div className="audit-time">
                        <small>{act.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2>+ Create New User (Admin Provision)</h2>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
              Provision a new account with custom role and platform access credentials.
            </p>
            <form onSubmit={handleCreateUser}>
              <div className="modal-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  placeholder="e.g. Shikha Bansal"
                />
              </div>

              <div className="modal-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  placeholder="e.g. user@example.com"
                />
              </div>

              <div className="modal-group">
                <label>Password *</label>
                <input
                  type="password"
                  required
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                />
              </div>

              <div className="modal-group">
                <label>Platform Role *</label>
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value })
                  }
                >
                  <option value="client">Client (Hire Talent)</option>
                  <option value="freelancer">Freelancer (Work & Earn)</option>
                  <option value="admin">Administrator (Super Admin)</option>
                </select>
              </div>

              <div className="modal-group">
                <label>Title / Organization</label>
                <input
                  type="text"
                  value={newUserData.title}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, title: e.target.value })
                  }
                  placeholder={
                    newUserData.role === "client"
                      ? "e.g. Bansal Enterprises"
                      : "e.g. Full Stack Engineer"
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-primary-admin"
                  disabled={creatingUser}
                >
                  {creatingUser ? "Creating..." : "Create User Account"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-admin"
                  onClick={() => setShowAddUser(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
