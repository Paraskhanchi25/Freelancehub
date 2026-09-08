import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import FreelancerCard from "../../components/FreelancerCard/FreelancerCard";

import "./FindTalent.css";

function FindTalent() {

  const people = [
    {
      name: "Arvind ",
      role: "UI/UX Designer",
      description: "Modern and user-friendly designs.",
      rating: "4.9",
      earned: "₹85K",
      rate: "900",
      image: "https://i.pravatar.cc/400?img=12"
    },

    {
      name: "Pawan",
      role: "Full Stack Developer",
      description: "Fast and scalable web applications.",
      rating: "4.8",
      earned: "₹1.2L",
      rate: "1200",
      image: "https://i.pravatar.cc/400?img=47"
    }
  ];

  return (
    <>
      <Navbar />

      <section className="talent-page">

        <h1>Find Talent</h1>

        <p>
          Find skilled people for your next project.
        </p>

        <div className="talent-grid">

          {people.map((person, index) => (
            <FreelancerCard
              key={index}
              person={person}
            />
          ))}

        </div>

      </section>

      <Footer />
    </>
  );
}

export default FindTalent;