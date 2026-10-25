import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/find-work?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/find-work");
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>The Next-Gen Freelance Network</span>
        </div>

        <h1 className="hero-title">
          Hire great freelancers,
          <br />
          <span className="hero-title-gradient">do greater work.</span>
        </h1>

        <p className="hero-subtitle">
          Connect with top vetted developers, designers, and domain experts.
          Real-time hiring, secure collaboration, and fair budgets.
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <div className="search-icon-wrap">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search any skill or project (e.g. React, UI/UX, Python, Video)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="submit" aria-label="Search jobs">
            Search
          </button>
        </form>

        <div className="hero-tags-row">
          <span className="hero-tags-label">Popular:</span>
          <div className="hero-buttons">
            <Link to="/find-work?search=Web">Web Development</Link>
            <Link to="/find-work?search=React">React</Link>
            <Link to="/find-work?search=Design">UI/UX Design</Link>
            <Link to="/find-work?search=Python">Python</Link>
            <Link to="/find-work?search=Video">Video Editing</Link>
          </div>
        </div>

        <div className="hero-stats-strip">
          <div className="hero-stat-item">
            <strong>Curated</strong>
            <span>Talent Network</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <strong>Transparent</strong>
            <span>Proposals & Bids</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <strong>Direct</strong>
            <span>Client Contracting</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;