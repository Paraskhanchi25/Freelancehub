import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../../services/jobService";
import { proposalService } from "../../../services/proposalService";
import { useAuth } from "../../../context/useAuth";
import "./HireModal.css";

function HireModal({ freelancer, isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientJobs, setClientJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [hireMode, setHireMode] = useState("existing"); // 'existing' or 'new'
  const [offerAmount, setOfferAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("5-7 days");
  const [contractMessage, setContractMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !user) return;

    let isMounted = true;

    // Fetch jobs posted by this client
    jobService
      .getJobsByClient(user.id, user.email, user.name)
      .then((jobs) => {
        if (!isMounted) return;
        const activeOnly = (jobs || []).filter(
          (j) => j.status?.toLowerCase() === "active"
        );
        setClientJobs(activeOnly);
        if (activeOnly.length > 0) {
          setSelectedJobId(String(activeOnly[0].id));
          setOfferAmount(activeOnly[0].budget || freelancer?.rate || "5,000");
        } else {
          // If client has no jobs, default to "new" mode
          setHireMode("new");
        }
        setLoadingJobs(false);
      })
      .catch((err) => {
        console.error("Failed to load client jobs:", err);
        if (isMounted) setLoadingJobs(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, user, freelancer]);

  if (!isOpen || !freelancer) return null;

  // Selected job object
  const selectedJob = clientJobs.find((j) => String(j.id) === String(selectedJobId));

  const handleJobSelectChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    const chosen = clientJobs.find((j) => String(j.id) === String(jobId));
    if (chosen?.budget) {
      setOfferAmount(chosen.budget);
    }
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedJob) {
      setError("Please select an active project to hire for.");
      return;
    }

    if (!offerAmount.trim()) {
      setError("Please enter the agreed contract offer amount.");
      return;
    }

    setSubmitting(true);
    try {
      // Create hired contract proposal in proposalService
      const newContract = await proposalService.createProposal({
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        clientId: user.id,
        clientEmail: user.email,
        freelancerId: freelancer.id,
        freelancerName: freelancer.name,
        freelancerEmail: freelancer.email || `${freelancer.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
        freelancerAvatar: freelancer.image || freelancer.avatar || "",
        freelancerRole: freelancer.role || freelancer.title || "Freelancer",
        bidAmount: offerAmount.trim(),
        estimatedDays: estimatedDays.trim(),
        coverLetter:
          contractMessage.trim() ||
          `Direct Hire Offer from ${user.name}: We would love to have you work on our "${selectedJob.title}" project under agreed terms.`,
        status: "Hired",
      });

      setSuccessData(newContract);
    } catch (err) {
      console.error("Hiring error:", err);
      setError("Failed to create hiring contract. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToPostJob = () => {
    onClose();
    navigate("/post-job", {
      state: {
        targetFreelancer: freelancer.name,
        targetFreelancerId: freelancer.id,
        suggestedRate: freelancer.rate,
        category: freelancer.role || freelancer.primarySkill || "Web Development",
      },
    });
  };

  return (
    <div className="hire-modal-backdrop" onClick={onClose}>
      <div
        className="hire-modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-modal-title"
      >
        <button className="hire-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Modal Header */}
        <div className="hire-modal-header">
          <div className="hire-candidate-cluster">
            {freelancer.image || freelancer.avatar ? (
              <img
                src={freelancer.image || freelancer.avatar}
                alt={freelancer.name}
                className="hire-candidate-avatar"
              />
            ) : (
              <div className="hire-candidate-initials">
                {freelancer.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span className="hire-supertitle">Hire Talent</span>
              <h2 id="hire-modal-title" className="hire-candidate-name">
                {freelancer.name}
              </h2>
              <p className="hire-candidate-meta">
                <span>{freelancer.role || freelancer.title}</span>
                {freelancer.rate && (
                  <span className="hire-rate-badge">
                    ₹{String(freelancer.rate).replace(/[^0-9]/g, "")}/hr
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Success Screen */}
        {successData ? (
          <div className="hire-success-view">
            <div className="hire-success-icon">🎉</div>
            <h3>Contract Created & Talent Hired!</h3>
            <p>
              You have successfully hired <strong>{freelancer.name}</strong> for{" "}
              <strong>&quot;{selectedJob?.title}&quot;</strong> at{" "}
              <strong className="hire-success-amt">₹{successData.bidAmount}</strong>.
            </p>
            <div className="hire-success-actions">
              <button
                type="button"
                className="btn-hire-primary"
                onClick={() => {
                  onClose();
                  navigate("/client-dashboard");
                }}
              >
                Go to Client Dashboard →
              </button>
              <button type="button" className="btn-hire-secondary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="hire-modal-content">
            {error && <div className="hire-error-banner">{error}</div>}

            {/* Mode Switcher Tabs */}
            <div className="hire-mode-tabs">
              <button
                type="button"
                className={`hire-tab-btn ${hireMode === "existing" ? "active" : ""}`}
                onClick={() => setHireMode("existing")}
              >
                📁 Hire for an Existing Project
              </button>
              <button
                type="button"
                className={`hire-tab-btn ${hireMode === "new" ? "active" : ""}`}
                onClick={() => setHireMode("new")}
              >
                ✨ Post a New Job for {freelancer.name}
              </button>
            </div>

            {/* MODE 1: HIRE FOR EXISTING PROJECT */}
            {hireMode === "existing" && (
              <div className="hire-existing-section">
                {loadingJobs ? (
                  <div className="hire-loading">Loading your posted projects...</div>
                ) : clientJobs.length === 0 ? (
                  <div className="hire-empty-jobs">
                    <span className="empty-icon">📋</span>
                    <h4>You don&apos;t have any active jobs posted yet</h4>
                    <p>
                      Post a project first, or create a targeted job specifically for{" "}
                      {freelancer.name}.
                    </p>
                    <button
                      type="button"
                      className="btn-hire-primary"
                      onClick={handleGoToPostJob}
                    >
                      + Post a Job for {freelancer.name} Now
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleHireSubmit} className="hire-form">
                    <div className="hire-field-group">
                      <label htmlFor="select-job">Choose Which Project to Hire For *</label>
                      <select
                        id="select-job"
                        value={selectedJobId}
                        onChange={handleJobSelectChange}
                        className="hire-select"
                        required
                      >
                        {clientJobs.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.title} (Budget: ₹{j.budget || "Negotiable"} • {j.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedJob && (
                      <div className="selected-job-summary-card">
                        <div className="summary-card-header">
                          <span className="summary-cat">{selectedJob.category}</span>
                          <span className="summary-budget">
                            Budget: ₹{selectedJob.budget}
                          </span>
                        </div>
                        <p className="summary-desc">{selectedJob.description}</p>
                      </div>
                    )}

                    <div className="hire-field-row">
                      <div className="hire-field-group">
                        <label htmlFor="offer-amount">Agreed Contract Amount (₹) *</label>
                        <input
                          id="offer-amount"
                          type="text"
                          placeholder="e.g. 15,000"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          required
                          className="hire-input"
                        />
                      </div>

                      <div className="hire-field-group">
                        <label htmlFor="est-days">Estimated Delivery / Timeline</label>
                        <input
                          id="est-days"
                          type="text"
                          placeholder="e.g. 5 days, 2 weeks"
                          value={estimatedDays}
                          onChange={(e) => setEstimatedDays(e.target.value)}
                          className="hire-input"
                        />
                      </div>
                    </div>

                    <div className="hire-field-group">
                      <label htmlFor="contract-msg">
                        Offer Message / Terms for {freelancer.name}
                      </label>
                      <textarea
                        id="contract-msg"
                        placeholder="Provide project kickoff details, expected milestones, or instructions..."
                        value={contractMessage}
                        onChange={(e) => setContractMessage(e.target.value)}
                        rows={3}
                        className="hire-textarea"
                      />
                    </div>

                    <div className="hire-actions-row">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-hire-primary"
                      >
                        {submitting ? "Creating Contract..." : `Hire ${freelancer.name} Now →`}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-hire-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* MODE 2: POST A NEW JOB FOR THIS FREELANCER */}
            {hireMode === "new" && (
              <div className="hire-new-job-section">
                <div className="hire-new-banner">
                  <div className="new-banner-icon">🚀</div>
                  <div className="new-banner-text">
                    <h4>Create a Custom Job for {freelancer.name}</h4>
                    <p>
                      Draft a new project with your custom budget, specifications, and
                      timeline. {freelancer.name} will be invited directly once posted.
                    </p>
                  </div>
                </div>

                <div className="hire-new-features">
                  <div className="feature-item">
                    <span>🖼️</span>
                    <div>
                      <strong>Upload Job Cover Image</strong>
                      <small>Attach high-res project artwork or design previews</small>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span>💰</span>
                    <div>
                      <strong>Set Milestone or Fixed Budget</strong>
                      <small>Suggested rate: ₹{freelancer.rate || "1,000"}/hr</small>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span>🎯</span>
                    <div>
                      <strong>Targeted Freelancer Invitation</strong>
                      <small>Directly connects to {freelancer.name}&apos;s dashboard</small>
                    </div>
                  </div>
                </div>

                <div className="hire-actions-row">
                  <button
                    type="button"
                    onClick={handleGoToPostJob}
                    className="btn-hire-primary"
                  >
                    Proceed to Post Job Form →
                  </button>
                  <button type="button" onClick={onClose} className="btn-hire-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HireModal;
