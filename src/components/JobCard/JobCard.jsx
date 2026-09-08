import { Link } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job }) {
  return (
    <div className="job-card">

      <h3>{job.title}</h3>

      <p>{job.description}</p>

      <h4>₹{job.budget}</h4>

      <div className="skills">

        {job.skills.map((skill, index) => (
          <span key={index}>
            {skill}
          </span>
        ))}

      </div>

      <Link to={`/job-details/${job.id}`}>
        View Job →
      </Link>

    </div>
  );
}

export default JobCard;