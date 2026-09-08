import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        DevLance
      </Link>

      <div className="nav-links">
        <Link to="/find-work">Find Work</Link>
        <Link to="/find-talent">Find Talent</Link>
        <Link to="/post-job">Post a Job</Link>
        <Link to="/calculator">Calculator</Link>
        <Link to="/about">About</Link>
        <Link to="/help">Help</Link>
      </div>

      <div className="nav-buttons">
        <Link to="/login">Log In</Link>
        <Link to="/signup" className="signup">
          Sign Up
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;