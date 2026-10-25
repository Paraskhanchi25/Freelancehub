import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../../../services/jobService";
import "./ProjectCarousel.css";

const fallbackProjects = [
  {
    id: "4",
    title: "Website Development",
    description: "Build a modern, responsive business website from scratch with clean frontend architecture.",
    category: "Web Development",
    budget: "25,000",
    skills: ["React", "Node.js", "CSS"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
    client: "Himakshi",
  },
  {
    id: "5",
    title: "Mobile App Development",
    description: "Create a cross-platform mobile app for a fitness and wellness startup.",
    category: "App Development",
    budget: "60,000",
    skills: ["React Native", "Firebase"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=600&q=80",
    client: "Tushar Bansal",
  },
  {
    id: "6",
    title: "Logo & Brand Design",
    description: "Design a fresh logo, brand identity kit, and vector typography guidelines.",
    category: "UI/UX & Design",
    budget: "6,000",
    skills: ["Illustrator", "Branding"],
    location: "Chandigarh",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
    client: "Shikha Bansal",
  },
  {
    id: "7",
    title: "Video Editing for YouTube & Reels",
    description: "Edit a series of short-form reels and long-form YouTube tutorials.",
    category: "Video & Animation",
    budget: "8,000",
    skills: ["Premiere Pro", "After Effects"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    client: "Himakshi",
  },
  {
    id: "8",
    title: "Data Cleaning & Entry Automation",
    description: "Organize, validate, and clean up a large e-commerce product catalog spreadsheet.",
    category: "Data Entry",
    budget: "3,500",
    skills: ["Excel", "Google Sheets"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    client: "Tushar Bansal",
  },
  {
    id: "9",
    title: "SEO Content Writing for Tech Blog",
    description: "Write engaging, SEO-optimized articles covering developer tooling and frameworks.",
    category: "Content Writing",
    budget: "5,000",
    skills: ["SEO", "Content Writing"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    client: "Shikha Bansal",
  },
  {
    id: "10",
    title: "Marketing Graphic Design & Banners",
    description: "Design social media banners, marketing graphics, and display ads.",
    category: "UI/UX & Design",
    budget: "4,500",
    skills: ["Photoshop", "Figma"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?auto=format&fit=crop&w=600&q=80",
    client: "Himakshi",
  },
  {
    id: "11",
    title: "Digital Marketing & Paid Ads Campaign",
    description: "Run and manage targeted Meta and Google ad campaigns to drive conversions.",
    category: "Digital Marketing",
    budget: "15,000",
    skills: ["Meta Ads", "Google Ads"],
    location: "Remote",
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80",
    client: "Tushar Bansal",
  },
  {
    id: "12",
    title: "Product Photography for E-Commerce",
    description: "Shoot and retouch professional studio product photography for an apparel store.",
    category: "Photography",
    budget: "10,000",
    skills: ["Product Photography", "Lightroom"],
    location: "Mohali",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80",
    client: "Shikha Bansal",
  },
  {
    id: "13",
    title: "Smart Office Electrical Wiring & Setup",
    description: "Install safe electrical wiring, network cable conduits, and lighting fixtures.",
    category: "Local Services",
    budget: "2,500",
    skills: ["Electrical", "Wiring"],
    location: "Rajpura",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    client: "Himakshi",
  },
];

function ProjectCarousel() {
  const trackRef = useRef(null);
  const [projectsList, setProjectsList] = useState(fallbackProjects);

  useEffect(() => {
    let isMounted = true;
    jobService.getJobs().then((jobs) => {
      if (isMounted && Array.isArray(jobs) && jobs.length > 0) {
        // Map actual jobs with images from database or fallbacks
        const mapped = jobs.map((j, index) => ({
          ...j,
          image: j.image || fallbackProjects[index % fallbackProjects.length].image,
        }));
        setProjectsList(mapped);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
          {projectsList.map((project) => {
            const skills = Array.isArray(project.skills)
              ? project.skills
              : typeof project.skills === "string"
              ? project.skills.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            const formattedBudget = project.budget
              ? `₹${String(project.budget).replace(/^₹/, "")}`
              : "Negotiable";

            return (
              <div className="project-slide-card" key={project.id}>
                <div className="project-image-wrap">
                  <img src={project.image} alt={project.title} />
                  <span className="project-category">{project.category}</span>
                </div>

                <div className="project-slide-info">
                  <h3>{project.title}</h3>
                  <p className="project-desc">{project.description}</p>

                  {skills.length > 0 && (
                    <div className="project-skills">
                      {skills.slice(0, 3).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  )}

                  <div className="project-meta">
                    <span>💰 {formattedBudget}</span>
                    <span>📍 {project.location || "Remote"}</span>
                  </div>

                  {project.client && (
                    <div className="project-client-line">
                      <span>Posted by <strong>{project.client}</strong></span>
                    </div>
                  )}

                  <Link to={`/job-details/${project.id}`} className="view-project-btn">
                    View Job Details →
                  </Link>
                </div>
              </div>
            );
          })}
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
