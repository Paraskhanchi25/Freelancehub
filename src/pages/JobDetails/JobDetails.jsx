import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./JobDetails.css";

function JobDetails() {

  const { id } = useParams();

  const jobs = [
    {
      id: "1",
      title: "React Developer",
      description: "Build a modern React website for a growing startup.",
      budget: "8,000",
      skills: "React • JavaScript • CSS"
    },

    {
      id: "2",
      title: "Graphic Designer",
      description: "Create branding material and social media designs.",
      budget: "5,000",
      skills: "Figma • Photoshop • Illustrator"
    },

    {
      id: "3",
      title: "Python Developer",
      description: "Build a Python application with a simple backend.",
      budget: "10,000",
      skills: "Python • Django • SQL"
    }
  ];

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return <h1>Job not found</h1>;
  }

  return (
    <>
      <Navbar />

      <section className="job-details">

        <h1>{job.title}</h1>

        <p>{job.description}</p>

        <h2>₹{job.budget}</h2>

        <h3>Skills</h3>

        <p>{job.skills}</p>

        <Link to="/login">
          Apply Now →
        </Link>

      </section>

      <Footer />
    </>
  );
}

export default JobDetails;