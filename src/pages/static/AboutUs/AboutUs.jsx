import { Link } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import "./AboutUs.css";

function AboutUs() {
  const team = [
    {
      name: "Tushar Bansal",
      role: "Founder & CEO",
      img: "/assets/Tushar.jpeg",
      bio: "Passionate about connecting talent with opportunity.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Design",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Crafting beautiful and intuitive user experiences.",
    },
    {
      name: "Aarav Singh",
      role: "Lead Developer",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Building robust platforms that scale effortlessly.",
    },
    {
      name: "Ananya Joshi",
      role: "Community Manager",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Growing a thriving community of freelancers and clients.",
    },
  ];

  const values = [
    {
      icon: "🤝",
      title: "Trust",
      desc: "We build transparent relationships between clients and freelancers.",
    },
    {
      icon: "🚀",
      title: "Growth",
      desc: "We help every professional unlock their full earning potential.",
    },
    {
      icon: "🌍",
      title: "Inclusivity",
      desc: "FreelanceHub is for everyone — regardless of location or background.",
    },
    {
      icon: "⚡",
      title: "Speed",
      desc: "Get hired or find talent faster than any traditional method.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-tag">OUR STORY</p>
          <h1>Built by freelancers, <br /> for freelancers.</h1>
          <p>
            FreelanceHub started as a student project with a simple idea — make it
            easier for talented people to find great work, and for businesses to
            find the right talent, without the noise.
          </p>
          <Link to="/signup" className="about-cta">
            Join FreelanceHub Today
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <div>
            <p className="about-tag">OUR MISSION</p>
            <h2>Empowering the future of work.</h2>
            <p>
              We believe work should be flexible, fair, and fulfilling. FreelanceHub
              connects skilled professionals with clients who need them — cutting
              out the middleman and putting more money in freelancers&apos; pockets.
            </p>
            <p>
              Built as an ambitious innovation project at Chitkara University, FreelanceHub demonstrates
              how modern freelance collaboration should work: transparent contracts, instant talent
              discovery, and direct connections between ambitious clients and creators.
            </p>
          </div>
          <div className="mission-stats">
            <div>
              <h3>100%</h3>
              <p>Direct Contracts</p>
            </div>
            <div>
              <h3>0%</h3>
              <p>Hidden Fees</p>
            </div>
            <div>
              <h3>₹0</h3>
              <p>Upfront Posting</p>
            </div>
            <div>
              <h3>Fast</h3>
              <p>Matching</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <p className="about-tag center">WHAT WE STAND FOR</p>
        <h2>Our core values</h2>
        <div className="values-grid">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <span>{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <p className="about-tag center">THE PEOPLE BEHIND FREELANCEHUB</p>
        <h2>Meet our team</h2>
        <div className="team-grid">
          {team.map((member) => (
            <div className="team-card" key={member.name}>
              <img src={member.img} alt={member.name} />
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="about-cta-strip">
        <h2>Ready to get started?</h2>
        <p>Join thousands of professionals already on FreelanceHub.</p>
        <div className="about-cta-buttons">
          <Link to="/signup" className="btn-orange">Create Account</Link>
          <Link to="/find-work" className="btn-outline">Browse Jobs</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AboutUs;
