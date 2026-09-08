import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import JobCard from "../../components/JobCard/JobCard";

import "./FindWork.css";

function FindWork() {

  const jobs = [
    {
      id: "1",
      title: "React Developer",
      description: "Build a modern React website.",
      budget: "8,000",
      skills: ["React", "JavaScript"]
    },

    {
      id: "2",
      title: "Graphic Designer",
      description: "Create branding material for a startup.",
      budget: "5,000",
      skills: ["Figma", "Design"]
    },

    {
      id: "3",
      title: "Python Developer",
      description: "Build a Python application.",
      budget: "10,000",
      skills: ["Python", "Django"]
    }
  ];

  return (
    <>
      <Navbar />

      <section className="find-work">

        <h1>Find Work</h1>

        <p>
          Discover projects that match your skills.
        </p>

        <div className="jobs">

          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}

        </div>

      </section>

      <Footer />
    </>
  );
}

export default FindWork;