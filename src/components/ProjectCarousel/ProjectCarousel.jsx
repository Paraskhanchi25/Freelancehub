import { useRef } from "react";
import { Link } from "react-router-dom";
import "./ProjectCarousel.css";

const projects = [
  {
    id: 1,
    title: "Website Development",
    description: "Build a modern, responsive business website from scratch.",
    category: "Web Development",
    budget: "₹25,000",
    skills: ["React", "Node.js", "CSS"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Create a cross-platform app for a fitness startup.",
    category: "App Development",
    budget: "₹60,000",
    skills: ["React Native", "Firebase"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Logo & Brand Design",
    description: "Design a fresh logo and brand identity kit for a café.",
    category: "Design",
    budget: "₹6,000",
    skills: ["Illustrator", "Branding"],
    location: "Chandigarh",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Video Editing",
    description: "Edit a series of short-form reels for social media.",
    category: "Video & Animation",
    budget: "₹8,000",
    skills: ["Premiere Pro", "Motion Graphics"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Data Entry",
    description: "Organize and clean up a large product spreadsheet.",
    category: "Data Entry",
    budget: "₹3,500",
    skills: ["Excel", "Google Sheets"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Content Writing",
    description: "Write SEO-friendly blog articles for a travel brand.",
    category: "Content Writing",
    budget: "₹500 / article",
    skills: ["SEO", "Copywriting"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "Graphic Design",
    description: "Design social media creatives and marketing banners.",
    category: "Graphic Design",
    budget: "₹4,500",
    skills: ["Photoshop", "Canva"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    title: "Digital Marketing",
    description: "Run and manage a paid ad campaign for product launch.",
    category: "Digital Marketing",
    budget: "₹15,000",
    skills: ["Meta Ads", "SEO"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    title: "Photography",
    description: "Shoot product photos for an online clothing store.",
    category: "Photography",
    budget: "₹10,000",
    skills: ["Product Photography", "Lightroom"],
    location: "Mohali",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    title: "Home Repair / Local Services",
    description: "Fix electrical wiring and fittings in a two-room flat.",
    category: "Local Services",
    budget: "₹2,000",
    skills: ["Electrician", "On-site"],
    location: "Rajpura",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
  },
];

function ProjectCarousel() {
  const trackRef = useRef(null);

  const scrollByAmount = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = track.firstChild
      ? track.firstChild.getBoundingClientRect().width + 22
      : 300;

    track.scrollBy({
      left: direction * cardWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="project-carousel">

      <div className="section-heading">
        <p>BROWSE OPPORTUNITIES</p>
        <h2>Explore Projects & Opportunities</h2>
      </div>

      <div className="carousel-wrapper">

        <button
          className="carousel-btn prev"
          onClick={() => scrollByAmount(-1)}
          aria-label="Previous projects"
        >
          ‹
        </button>

        <div className="carousel-track" ref={trackRef}>

          {projects.map((project) => (
            <div className="project-slide-card" key={project.id}>

              <div className="project-image-wrap">
                <img src={project.image} alt={project.title} />
                <span className="project-category">{project.category}</span>
              </div>

              <div className="project-slide-info">
                <h3>{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-skills">
                  {project.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="project-meta">
                  <span>💰 {project.budget}</span>
                  <span>📍 {project.location}</span>
                </div>

                <Link to="/find-work" className="view-project-btn">
                  View Project →
                </Link>
              </div>

            </div>
          ))}

        </div>

        <button
          className="carousel-btn next"
          onClick={() => scrollByAmount(1)}
          aria-label="Next projects"
        >
          ›
        </button>

      </div>

    </section>
  );
}

export default ProjectCarousel;
