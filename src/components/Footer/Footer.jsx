import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div>
          <h2>WorkHub</h2>
          <p>Work. Connect. Grow.</p>
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
            Join WorkHub
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
            href="https://www.chitkara.edu.in/"
            target="_blank"
            rel="noreferrer"
          >
            Chitkara University
          </a>
        </div>

        <div>
          <h3>Company</h3>

          <Link to="/about">About Us</Link>

          <Link to="/help">Help Center</Link>

          <Link to="/calculator">Rate Calculator</Link>
        </div>

      </div>

      <div className="copyright">
        © 2026 WorkHub | Student Project
      </div>

    </footer>
  );
}

export default Footer;