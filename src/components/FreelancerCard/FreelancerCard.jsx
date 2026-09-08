import { Link } from "react-router-dom";
import "./FreelancerCard.css";

function FreelancerCard({ person }) {
  return (
    <div className="freelancer-card">

      <img src={person.image} alt={person.name} />

      <h3>{person.name} ✓</h3>

      <p className="role">{person.role}</p>

      <p className="description">
        {person.description}
      </p>

      <div className="stats">

        <div>
          ⭐ {person.rating}
          <small>Rating</small>
        </div>

        <div>
          {person.earned}
          <small>Earned</small>
        </div>

        <div>
          ₹{person.rate}/hr
          <small>Rate</small>
        </div>

      </div>

      <Link
        to={`/profile/${person.id}`}
        className="contact"
      >
        ✉ Get in Touch
      </Link>

    </div>
  );
}

export default FreelancerCard;