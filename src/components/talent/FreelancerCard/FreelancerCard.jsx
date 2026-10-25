import { useState } from "react";
import { Link } from "react-router-dom";
import "./FreelancerCard.css";

function FreelancerCard({ person }) {
  const [imgError, setImgError] = useState(false);

  const fallbackInitial = person.name
    ? person.name.charAt(0).toUpperCase()
    : "F";

  const rateDisplay = person.rate
    ? `₹${String(person.rate).replace(/[^0-9]/g, "")}/hr`
    : "Negotiable";

  const isAvailable = person.availability
    ? person.availability.toLowerCase().includes("avail")
    : true;

  const skillsList = Array.isArray(person.skills)
    ? person.skills
    : typeof person.skills === "string"
    ? person.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="freelancer-card">
      <div className="freelancer-card-media">
        {!imgError && person.image ? (
          <img
            src={person.image}
            alt={person.name}
            onError={() => setImgError(true)}
            className="freelancer-img"
          />
        ) : (
          <div className="freelancer-img-placeholder">
            <span>{fallbackInitial}</span>
          </div>
        )}

        <span
          className={`availability-badge ${
            isAvailable ? "status-available" : "status-busy"
          }`}
        >
          {isAvailable ? "● Available" : "● Busy"}
        </span>
      </div>

      <div className="freelancer-body">
        <div className="freelancer-header">
          <h3 className="freelancer-name">
            <Link to={`/profile/${person.id}`}>{person.name}</Link>
            <span className="verified-badge" title="Verified Professional">
              ✓
            </span>
          </h3>
          <p className="freelancer-role">{person.role || person.primarySkill}</p>
        </div>

        <p className="freelancer-description">
          {person.description || "Experienced freelancer ready to collaborate."}
        </p>

        {skillsList.length > 0 && (
          <div className="freelancer-skills">
            {skillsList.slice(0, 3).map((skill) => (
              <span key={skill} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="freelancer-stats-bar">
          <div className="stat-col">
            <span className="stat-val">⭐ {person.rating || "5.0"}</span>
            <small className="stat-lbl">Rating</small>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-col">
            <span className="stat-val">{person.earned || "₹50K+"}</span>
            <small className="stat-lbl">Earned</small>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-col">
            <span className="stat-val">{rateDisplay}</span>
            <small className="stat-lbl">Rate</small>
          </div>
        </div>

        <Link to={`/profile/${person.id}`} className="btn-freelancer-action">
          View Profile & Hire →
        </Link>
      </div>
    </div>
  );
}

export default FreelancerCard;