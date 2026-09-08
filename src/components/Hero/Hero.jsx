import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Hire great freelancers,
          <br />
          do greater work.
        </h1>

        <form className="search-box">
          <input
            type="text"
            placeholder="Search for any service"
          />

          <button type="submit">
            <a href="https://emoji.gg/emoji/883238-search"><img src="https://cdn3.emoji.gg/emojis/883238-search.png" width="34px" height="34px" alt="Search"></img></a>
          </button>
        </form>

        <div className="hero-buttons">

          <Link to="/find-work">
            Web development →
          </Link>

          <Link to="/find-work">
            Logo design →
          </Link>

          <Link to="/find-work">
            Video editing →
          </Link>

          <Link to="/find-work">
            Social media →
          </Link>

        </div>

        <p>
          Find talented freelancers for your next project.
        </p>

      </div>

    </section>
  );
}

export default Hero;