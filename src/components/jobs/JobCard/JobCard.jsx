import { Link } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job }) {
  const skillsArray = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
    ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const isActive = job.status ? job.status.toLowerCase() === "active" : true;

  // Format budget cleanly
  const budgetDisplay = job.budget
    ? `₹${String(job.budget).replace(/^₹/, "")}`
    : "Negotiable";

  return (
    <div className={`job-card ${job.image ? "job-card-has-image" : ""} ${!isActive ? "job-card-closed" : ""}`}>
      {/* Optional Cover Banner */}
      {job.image && (
        <div className="job-card-image-wrap">
          <Link to={`/job-details/${job.id}`}>
            <img
              src={job.image}
              alt={job.title}
              className="job-card-cover"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = "none";
              }}
            />
          </Link>
        </div>
      )}

      {/* Header with Title and Status */}
      <div className="job-card-top">
        <h3 className="job-card-title">
          <Link to={`/job-details/${job.id}`}>{job.title}</Link>
        </h3>
        {job.status && (
          <span className={`job-status-badge ${isActive ? "status-active" : "status-closed"}`}>
            {job.status}
          </span>
        )}
      </div>

      {/* Meta tags: Category & Posted */}
      <div className="job-card-meta">
        {job.category && (
          <span className="job-meta-category">
            <span className="meta-icon">📁</span> {job.category}
          </span>
        )}
        {job.posted && (
          <span className="job-meta-posted">
            <span className="meta-icon">🕒</span> {job.posted}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="job-card-desc">{job.description}</p>

      {/* Skills Badges */}
      {skillsArray.length > 0 && (
        <div className="job-skills-list">
          {skillsArray.slice(0, 4).map((skill, index) => (
            <span key={index} className="job-skill-pill">
              {skill}
            </span>
          ))}
          {skillsArray.length > 4 && (
            <span className="job-skill-more">+{skillsArray.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer with Budget, Client & Action */}
      <div className="job-card-footer">
        <div className="job-budget-wrap">
          <span className="budget-label">Budget</span>
          <span className="budget-val">{budgetDisplay}</span>
        </div>

        <div className="job-card-action">
          {job.client && (
            <span className="job-client-name" title={`Posted by ${job.client}`}>
              by {job.client}
            </span>
          )}
          <Link
            to={`/blueprint?jobId=${job.id}`}
            className="btn-card-blueprint"
            title="Generate AI System Architecture & Flow"
          >
            ⚡ Blueprint
          </Link>
          <Link to={`/job-details/${job.id}`} className="btn-view-job">
            View Job →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobCard;