import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./RecommendedProfessionals.css";

// Mock talent pool. Replace with a real API response later —
// the shape and matching logic below can stay the same.
const talentPool = [
  {
    id: 1,
    name: "Himakshi",
    primarySkill: "UI/UX Designer",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
    rating: 4.9,
    completedProjects: 64,
    experience: "2 yrs",
    rate: "₹900/hr",
    distanceKm: 3,
    availability: "Available now",
    image: "./src/assets/Somyaa.jpeg",
  },
  {
    id: 2,
    name: "Paras Khanchi",
    primarySkill: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    rating: 4.8,
    completedProjects: 91,
    experience: "2 yrs",
    rate: "₹1200/hr",
    distanceKm: 8,
    availability: "Available now",
    image: "./src/assets/Myself.jpeg",
  },
  {
    id: 3,
    name: "Tushar Bansal",
    primarySkill: "Graphic Designer",
    skills: ["Branding", "Illustrator", "Logo Design", "Photoshop"],
    rating: 4.9,
    completedProjects: 58,
    experience: "2 yrs",
    rate: "₹700/hr",
    distanceKm: 12,
    availability: "Busy till Fri",
    image: "./src/assets/Tushar.jpeg",
  },
  {
    id: 4,
    name: "Somya",
    primarySkill: "Content Writer",
    skills: ["SEO", "Copywriting", "Blogging", "Editing"],
    rating: 4.7,
    completedProjects: 47,
    experience: "3 yrs",
    rate: "₹600/hr",
    distanceKm: 5,
    availability: "Available now",
    image: "./src/assets/somya.jpeg",
  },
  {
    id: 5,
    name: "Varij Chauhan",
    primarySkill: "Frontend Developer",
    skills: ["React", "CSS", "JavaScript", "Tailwind"],
    rating: 4.8,
    completedProjects: 72,
    experience: "4 yrs",
    rate: "₹950/hr",
    distanceKm: 15,
    availability: "Available now",
    image: "./src/assets/Varij.jpeg",
  },
  {
    id: 6,
    name: "Ashutosh verma",
    primarySkill: "Video Editor",
    skills: ["Premiere Pro", "After Effects", "Motion Graphics"],
    rating: 4.6,
    completedProjects: 39,
    experience: "1 yrs",
    rate: "₹650/hr",
    distanceKm: 20,
    availability: "Busy till Mon",
    image: "./src/assets/AshutoshV.jpeg",
  },
  {
    id: 7,
    name: "Sanchit Singla",
    primarySkill: "JavaScript Developer",
    skills: ["JavaScript", "Node.js", "React", "APIs"],
    rating: 4.9,
    completedProjects: 103,
    experience: "2 yrs",
    rate: "₹1400/hr",
    distanceKm: 9,
    availability: "Available now",
    image: "./src/assets/Sanchit.jpeg",
  },
  {
    id: 8,
    name: "Alex Dunphy",
    primarySkill: "Digital Marketer",
    skills: ["SEO", "Meta Ads", "Google Ads", "Analytics"],
    rating: 4.7,
    completedProjects: 55,
    experience: "5 yrs",
    rate: "₹850/hr",
    distanceKm: 6,
    availability: "Available now",
    image: "https://i.pravatar.cc/150?img=20",
  },
];

// Simple mock recommendation logic: Skill Match + Rating + Experience +
// Availability + Distance. No real AI here — just a weighted score that
// can be swapped for a backend/AI call later without changing the UI.
function getRecommendations(query, pool) {
  const words = query
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter(Boolean);

  if (words.length === 0) return [];

  return pool
    .map((person) => {
      const haystack = [person.primarySkill, ...person.skills]
        .join(" ")
        .toLowerCase();

      const skillMatches = words.filter((word) =>
        haystack.includes(word)
      ).length;

      if (skillMatches === 0) return null;

      const experienceYears = parseInt(person.experience, 10) || 0;
      const availabilityScore =
        person.availability === "Available now" ? 1 : 0;
      const distanceScore = 1 / (1 + person.distanceKm / 10);

      const score =
        skillMatches * 5 +
        person.rating * 2 +
        experienceYears * 0.5 +
        availabilityScore * 2 +
        distanceScore * 2;

      return { ...person, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

const exampleProjects = [
  "I need someone to build a React website",
  "Looking for a logo and brand design",
  "I want to edit short video reels",
  "Need SEO content writing for my blog",
];

function RecommendedProfessionals() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const recommendations = useMemo(
    () => getRecommendations(submittedQuery, talentPool),
    [submittedQuery]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    setSubmittedQuery(example);
  };

  return (
    <section className="recommended-professionals">

      <div className="section-heading">
        <p>TRY IT OUT</p>
        <h2>Recommended Professionals for Your Project</h2>
        <p className="subtext">
          Describe what you need and see a preview of the freelancers
          WorkHub would recommend for it.
        </p>
      </div>

      <form className="mini-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I need someone to build a React website"
        />
        <button type="submit">Find Matches</button>
      </form>

      <div className="example-chips">
        {exampleProjects.map((example) => (
          <button
            key={example}
            type="button"
            className="chip"
            onClick={() => handleExampleClick(example)}
          >
            {example}
          </button>
        ))}
      </div>

      {submittedQuery && (
        <p className="match-explanation">
          {recommendations.length > 0
            ? "Recommended based on your project requirements."
            : "No close matches yet — try a different skill or keyword."}
        </p>
      )}

      {recommendations.length > 0 && (
        <div className="recommend-grid">

          {recommendations.map((person) => (
            <div className="recommend-card" key={person.id}>

              <div className="recommend-top">
                <img src={person.image} alt={person.name} />

                <div>
                  <h3>{person.name}</h3>
                  <p className="primary-skill">{person.primarySkill}</p>
                </div>
              </div>

              <div className="recommend-tags">
                {person.skills.slice(0, 3).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <div className="recommend-stats">
                <div>
                  ⭐ {person.rating}
                  <small>Rating</small>
                </div>

                <div>
                  {person.completedProjects}
                  <small>Projects</small>
                </div>

                <div>
                  {person.experience}
                  <small>Experience</small>
                </div>
              </div>

              <div className="recommend-meta">
                <span>{person.rate}</span>
                <span>📍 {person.distanceKm} km away</span>
                <span
                  className={
                    person.availability === "Available now"
                      ? "available"
                      : "busy"
                  }
                >
                  {person.availability}
                </span>
              </div>

              <div className="recommend-actions">
                <Link to={`/profile/${person.id}`} className="view-profile">
                  View Profile
                </Link>

                <Link to={`/profile/${person.id}`} className="hire-btn">
                  Hire
                </Link>
              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default RecommendedProfessionals;
