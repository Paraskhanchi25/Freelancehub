import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thanks for subscribing to WorkHub updates!");
    e.target.reset();
  };

  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">
          <h2>WorkHub</h2>

          <p>Work. Connect. Grow.</p>

          <p className="footer-about">
            WorkHub is a freelance marketplace that connects clients with
            skilled professionals for web development, design, writing,
            marketing and more.
          </p>

          <form className="newsletter" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        <div>
          <h3>For Freelancers</h3>

          <Link to="/find-work">
            Find Work
          </Link>

          <Link to="/freelancer-dashboard">
            My Dashboard
          </Link>

          <Link to="/signup">
            Join as a Freelancer
          </Link>

          <Link to="/calculator">
            Rate Calculator
          </Link>

          <Link to="/help">
            Freelancer Help
          </Link>
        </div>

        <div>
          <h3>For Clients</h3>

          <Link to="/find-talent">
            Find Talent
          </Link>

          <Link to="/post-job">
            Post a Job
          </Link>

          <Link to="/client-dashboard">
            Client Dashboard
          </Link>

          <Link to="/find-work">
            Browse Projects
          </Link>

          <Link to="/help">
            Hiring Guide
          </Link>
        </div>

        <div>
          <h3>Popular Categories</h3>

          <Link to="/find-work">Web Development</Link>
          <Link to="/find-work">Graphic Design</Link>
          <Link to="/find-work">Content Writing</Link>
          <Link to="/find-work">Digital Marketing</Link>
          <Link to="/find-work">Video Editing</Link>
        </div>

        <div>
          <h3>Company</h3>

          <Link to="/about">About Us</Link>

          <Link to="/help">Help Center</Link>

          <Link to="/login">Log In</Link>

          <Link to="/signup">Sign Up</Link>
        </div>

        <div>
          <h3>Connect</h3>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
          >
            X (Twitter)
          </a>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://www.chitkara.edu.in/"
            target="_blank"
            rel="noreferrer"
          >
            Chitkara University
          </a>
        </div>

      </div>

      <div className="footer-trust">
        <span>🔒 Secure Payments</span>
        <span>⭐ Trusted by 10,000+ Users</span>
        <span>🕒 24/7 Support</span>
        <span>✅ Verified Freelancers</span>
      </div>

      <div className="copyright">
        © 2026 WorkHub | Student Project | Built at Chitkara University
      </div>

    </footer>
  );
}

export default Footer;
