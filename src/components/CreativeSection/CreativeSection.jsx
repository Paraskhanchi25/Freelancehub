import { Link } from "react-router-dom";
import "./CreativeSection.css";

function CreativeSection() {
  return (
    <section className="creative">

      <div className="creative-text">

        <p>EXPLORE YOUR POTENTIAL</p>

        <h2>
          One place for
          <br />
          every skill.
        </h2>

        <p>
          From coding and design to writing and marketing,
          find the right talent for every project.
        </p>

        <Link to="/find-work">
          Explore Services →
        </Link>

      </div>

      <div className="skill-stack">

        <div className="skill-card card-one">
          <span>01</span>
          <h3>Web Development</h3>
          <p>React • Node.js • Python</p>
        </div>

        <div className="skill-card card-two">
          <span>02</span>
          <h3>UI / UX Design</h3>
          <p>Figma • Branding • Creative</p>
        </div>

        <div className="skill-card card-three">
          <span>03</span>
          <h3>Content & Marketing</h3>
          <p>Writing • SEO • Social Media</p>
        </div>

        <div className="skill-card card-four">
          <span>04</span>
          <h3>Video & Animation</h3>
          <p>Editing • Motion • Reels</p>
        </div>

      </div>

    </section>
  );
}

export default CreativeSection;