import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-title">
            <span className="footer-icon">⚡</span>
            <h2>
              Freelance<span className="brand-accent">Hub</span>
            </h2>
          </div>

          <p className="footer-tagline">Work. Connect. Grow.</p>

          <p className="footer-about">
            FreelanceHub is a modern freelance marketplace connecting ambitious clients
            with vetted professionals for development, design, writing, marketing, and media.
          </p>

          {subscribed ? (
            <div className="newsletter-success">
              ✅ Thank you for subscribing to our updates!
            </div>
          ) : (
            <form className="newsletter" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>

        <div>
          <h3>For Freelancers</h3>
          <Link to="/find-work">Find Work</Link>
          <Link to="/freelancer-dashboard">Freelancer Dashboard</Link>
          <Link to="/signup">Join as a Freelancer</Link>
          <Link to="/calculator">Rate Calculator</Link>
          <Link to="/help">Freelancer Guide</Link>
        </div>

        <div>
          <h3>For Clients</h3>
          <Link to="/find-talent">Find Talent</Link>
          <Link to="/post-job">+ Post a Project</Link>
          <Link to="/client-dashboard">Client Dashboard</Link>
          <Link to="/find-work">Browse Listings</Link>
          <Link to="/help">Hiring Support</Link>
        </div>

        <div>
          <h3>Top Categories</h3>
          <Link to="/find-work?search=Web">Web Development</Link>
          <Link to="/find-work?search=Design">UI / UX Design</Link>
          <Link to="/find-work?search=Python">Backend & Python</Link>
          <Link to="/find-work?search=Content">Content Writing</Link>
          <Link to="/find-work?search=Video">Video & Animation</Link>
        </div>

        <div>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/signup">Create Account</Link>
          <Link to="/admin-dashboard" className="footer-admin-link">
            👑 Admin Portal
          </Link>
        </div>

        <div>
          <h3>Community</h3>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            X (Twitter)
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.chitkara.edu.in/" target="_blank" rel="noreferrer">
            Chitkara University
          </a>
        </div>
      </div>

      <div className="footer-trust">
        <span>🎓 Student Marketplace Concept</span>
        <span>⚡ Interactive Demo Database</span>
        <span>📁 Real-Time Project Pipeline</span>
        <span>💼 Direct Talent Contracting</span>
      </div>

      <div className="copyright">
        © 2026 FreelanceHub | Built with ambition at Chitkara University
      </div>
    </footer>
  );
}

export default Footer;
