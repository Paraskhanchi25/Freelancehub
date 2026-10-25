import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import { jobService } from "../../../services/jobService";
import { proposalService } from "../../../services/proposalService";
import { useAuth } from "../../../context/useAuth";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [jobProposals, setJobProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Proposal submission form state for freelancers
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("3-5 days");
  const [coverLetter, setCoverLetter] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    jobService
      .getJobById(id)
      .then((found) => {
        if (!isMounted) return;
        setJob(found);
        if (found) {
          setBidAmount(found.budget || "");
          return proposalService.getProposalsByJobId(id);
        }
        return [];
      })
      .then((props) => {
        if (!isMounted) return;
        setJobProposals(props || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading job:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    await jobService.deleteJob(job.id);
    navigate("/find-work");
  };

  // Submit Proposal
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim() || !bidAmount) {
      alert("Please enter both your proposed bid and a cover letter.");
      return;
    }

    setSubmittingProposal(true);
    try {
      const newProp = await proposalService.createProposal({
        jobId: job.id,
        jobTitle: job.title,
        clientId: job.clientId || "",
        clientEmail: job.clientEmail || "",
        freelancerId: user.id,
        freelancerName: user.name,
        freelancerEmail: user.email,
        freelancerAvatar: user.avatar || "",
        freelancerRole: user.title || "Freelancer",
        bidAmount: bidAmount.trim(),
        estimatedDays: estimatedDays.trim(),
        coverLetter: coverLetter.trim(),
        status: "Under Review",
      });

      setJobProposals((prev) => [newProp, ...prev]);
      setJob((prev) => prev ? { ...prev, proposals: (prev.proposals || 0) + 1 } : prev);
      setShowApplyModal(false);
      showToast("🎉 Proposal submitted successfully! Track it in your Freelancer Dashboard.");
    } catch (err) {
      alert("Failed to submit proposal: " + err.message);
    } finally {
      setSubmittingProposal(false);
    }
  };

  // Client proposal status updates
  const handleUpdateStatus = async (propId, newStatus, freelancerName) => {
    await proposalService.updateProposalStatus(propId, newStatus);
    setJobProposals((prev) =>
      prev.map((p) => (p.id === propId ? { ...p, status: newStatus } : p))
    );
    showToast(
      newStatus === "Hired"
        ? `🎉 Hired ${freelancerName}! An active contract has been established.`
        : `Proposal updated to: ${newStatus}`
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="job-details">
          <div className="loading-state-card" style={{ maxWidth: "450px", margin: "40px auto" }}>
            <div className="spinner"></div>
            <p>Loading project details...</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <section className="job-details not-found">
          <h1>Job Not Found</h1>
          <p>The job listing does not exist or has been removed.</p>
          <Link to="/find-work" className="btn-back">
            ← Back to All Jobs
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  const skillsList = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
    ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const isActive = job.status?.toLowerCase() === "active";

  // Ownership checks
  const isOwner =
    user &&
    ((job.clientId && String(job.clientId) === String(user.id)) ||
      (job.clientEmail && job.clientEmail.toLowerCase() === user.email?.toLowerCase()) ||
      (job.client && job.client.toLowerCase() === user.name?.toLowerCase()));

  const isAdmin = user?.role === "admin";
  const isFreelancer = user?.role === "freelancer";

  // Check if current freelancer has already submitted a proposal
  const myProposal =
    isFreelancer &&
    jobProposals.find(
      (p) =>
        (p.freelancerId && String(p.freelancerId) === String(user.id)) ||
        (p.freelancerEmail && p.freelancerEmail.toLowerCase() === user.email?.toLowerCase())
    );

  return (
    <>
      <Navbar />

      <section className="job-details">
        {toastMessage && (
          <div className="job-details-toast">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage("")}>✕</button>
          </div>
        )}

        <div className="details-container">
          <div className="details-header">
            <div>
              <Link to="/find-work" className="back-link">
                ← Back to Find Work
              </Link>
              <h1>{job.title}</h1>
              <div className="job-meta-row">
                {job.category && <span className="meta-tag">📁 {job.category}</span>}
                {job.client && <span className="meta-tag">👤 Client: {job.client}</span>}
                {job.posted && <span className="meta-tag">🕒 Posted: {job.posted}</span>}
                <span className={`status-badge ${isActive ? "active" : "closed"}`}>
                  {job.status || "Active"}
                </span>
                <span className="meta-tag">📄 {jobProposals.length} Proposals</span>
              </div>
            </div>

            <div className="header-actions">
              <Link to={`/blueprint?jobId=${job.id}`} className="btn-ai-blueprint">
                ⚡ AI Architecture & Blueprint
              </Link>
              {(isOwner || isAdmin) && (
                <>
                  <Link to={`/edit-job/${job.id}`} className="btn-edit">
                    ✏️ Edit Job
                  </Link>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="details-card">
            {job.image && (
              <div className="job-details-hero-wrap">
                <img
                  src={job.image}
                  alt={job.title}
                  className="job-details-hero-img"
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="budget-box">
              <small>Project Budget</small>
              <h2>₹{job.budget}</h2>
            </div>

            <div className="details-section">
              <h3>Project Description</h3>
              <p className="description-text">{job.description}</p>
            </div>

            {/* AI Architecture & Blueprint Callout */}
            <div className="job-ai-blueprint-box">
              <div className="ai-box-badge">
                <span>✨ Gemini 3.8 Flash Architecture Studio</span>
              </div>
              <div className="ai-box-body">
                <div>
                  <h4>Full Technical Blueprint Available</h4>
                  <p>
                    Generate full-stack system architecture, multi-tier topology, user & data flows,
                    codebase directory structure, and downloadable executive PDF blueprint for this project.
                  </p>
                </div>
                <Link to={`/blueprint?jobId=${job.id}`} className="btn-box-blueprint">
                  ⚡ Generate System Blueprint →
                </Link>
              </div>
            </div>

            <div className="details-section">
              <h3>Required Skills</h3>
              <div className="skills-tags">
                {skillsList.map((skill, index) => (
                  <span key={index} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Application Section */}
            <div className="details-footer">
              {!user ? (
                <Link
                  to="/login"
                  state={{
                    from: `/job-details/${job.id}`,
                    message: "Log in as a freelancer to apply for this project.",
                  }}
                  className="btn-apply"
                >
                  Log In to Apply →
                </Link>
              ) : isFreelancer ? (
                myProposal ? (
                  <div className="applied-status-badge">
                    <span>
                      ✅ You applied with a bid of <strong>₹{myProposal.bidAmount}</strong>
                    </span>
                    <span className="status-pill active" style={{ marginLeft: "10px" }}>
                      Status: {myProposal.status}
                    </span>
                    <Link to="/freelancer-dashboard" style={{ marginLeft: "15px", color: "#ff6b00", fontSize: "13px", fontWeight: "600" }}>
                      View in Dashboard →
                    </Link>
                  </div>
                ) : isActive ? (
                  <button
                    type="button"
                    className="btn-apply"
                    onClick={() => setShowApplyModal(true)}
                  >
                    Submit a Proposal →
                  </button>
                ) : (
                  <span style={{ color: "#ef4444", fontWeight: "600", fontSize: "14px" }}>
                    This job is currently closed for proposals.
                  </span>
                )
              ) : isOwner ? (
                <Link to="/client-dashboard" className="btn-secondary-link">
                  Manage This Job in Client Dashboard →
                </Link>
              ) : (
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Logged in as Client ({user.name}). To apply, please register as a Freelancer.
                </div>
              )}
            </div>
          </div>

          {/* Proposals / Applicants Section (Visible to Owner, Admin, or applied Freelancer) */}
          {(isOwner || isAdmin) && (
            <div className="job-applicants-section">
              <div className="applicants-header">
                <h2>Proposals Received ({jobProposals.length})</h2>
                <p>Review applicant pitches, quotes, and hire candidates for this project.</p>
              </div>

              {jobProposals.length === 0 ? (
                <div className="applicants-empty">
                  <p>No proposals submitted for this job yet.</p>
                </div>
              ) : (
                <div className="applicants-grid">
                  {jobProposals.map((prop) => (
                    <div className="applicant-card" key={prop.id}>
                      <div className="applicant-top">
                        <div className="applicant-identity">
                          {prop.freelancerAvatar ? (
                            <img src={prop.freelancerAvatar} alt={prop.freelancerName} className="applicant-avatar" />
                          ) : (
                            <div className="applicant-initials">
                              {prop.freelancerName?.[0] || "F"}
                            </div>
                          )}
                          <div>
                            <h4>{prop.freelancerName}</h4>
                            <p>{prop.freelancerRole || "Freelancer"}</p>
                            <small>{prop.freelancerEmail}</small>
                          </div>
                        </div>

                        <div className="applicant-bid">
                          <span>Bid Amount</span>
                          <strong>₹{prop.bidAmount}</strong>
                          {prop.estimatedDays && <small>Est: {prop.estimatedDays}</small>}
                        </div>
                      </div>

                      <p className="applicant-pitch">{prop.coverLetter}</p>

                      <div className="applicant-actions">
                        <span className={`status-badge ${prop.status === "Hired" ? "active" : prop.status === "Declined" ? "closed" : "pending"}`}>
                          {prop.status}
                        </span>

                        <div className="applicant-btn-group">
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
                                className="btn-hire"
                                onClick={() => handleUpdateStatus(prop.id, "Hired", prop.freelancerName)}
                              >
                                🤝 Hire Freelancer
                              </button>

                              {prop.status !== "Shortlisted" && (
                                <button
                                  type="button"
                                  className="btn-shortlist-sm"
                                  onClick={() => handleUpdateStatus(prop.id, "Shortlisted", prop.freelancerName)}
                                >
                                  ⭐ Shortlist
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-decline-sm"
                                onClick={() => handleUpdateStatus(prop.id, "Declined", prop.freelancerName)}
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
        </div>
      </section>

      {/* Proposal Submission Modal */}
      {showApplyModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2>Submit Proposal for &quot;{job.title}&quot;</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
              Client: <strong>{job.client}</strong> • Project Budget: <strong>₹{job.budget}</strong>
            </p>

            <form onSubmit={handleApplySubmit} style={{ marginTop: "20px" }}>
              <div className="modal-group">
                <label>Your Proposed Bid Amount (₹) *</label>
                <input
                  type="text"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="e.g. 7500"
                />
              </div>

              <div className="modal-group">
                <label>Estimated Delivery Time *</label>
                <select
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                >
                  <option value="1-2 days">1-2 days</option>
                  <option value="3-5 days">3-5 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>

              <div className="modal-group">
                <label>Cover Letter & Why You Are the Best Fit *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detail your relevant experience, approach to this project, and deliverables..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={submittingProposal}
                  className="btn-primary"
                >
                  {submittingProposal ? "Submitting..." : "Send Proposal →"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-admin"
                  onClick={() => setShowApplyModal(false)}
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

export default JobDetails;