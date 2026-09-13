import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Profile.css";

function Profile() {

  const { id } = useParams();
  

  const people = [
    {
      id: "1",
      name: "Somya",
      role: "UI/UX Designer",
      description: "I create clean and user-friendly digital experiences.",
      rating: "4.9",
      earned: "₹85K",
      rate: "900",
      skills: "Figma • UI Design • UX Research • Branding",
      image: "../../src/assets/somya.jpeg"
    },

    {
      id: "2",
      name: "Tushar Bansal",
      role: "Full Stack Developer",
      description: "I build fast and modern web applications.",
      rating: "4.8",
      earned: "₹1.2L",
      rate: "1200",
      image: "../../src/assets/Tushar.jpeg",
      skills: "React • Node.js • MongoDB • JavaScript",
    },

    {
      id: "3",name: "Himakshi",
      role: "Graphic Designer",
      description: "Branding, posters and creative visual designs.",
      rating: "4.9",
      earned: "₹72K",
      rate: "700",
      image: "../../src/assets/Somyaa.jpeg",
      skills: "Figma • Photoshop • Illustrator • Branding",
    },

    {
      id: "4",name: "Paras",
      role: "Content Writer",
      description: "Creative content that connects brands with people.",
      rating: "4.7",
      earned: "₹60K",
      rate: "600",
      image: "../../src/assets/Myself.jpeg",
      skills: "Writing • SEO • Blogs • Social Media",
    }
  ];

  const person = people.find((p) => p.id === id);

  if (!person) {
    return <h1>Profile not found</h1>;
  }

  return (
    <>
      <Navbar />

      <section className="profile">

        <div className="profile-card">

          <img
            src={person.image}
            alt={person.name}
          />

          <h1>{person.name}</h1>

          <h3>{person.role}</h3>

          <p>
            {person.description}
          </p>

          <h3>Rating</h3>

          <p>⭐{person.rating}</p>

          <h3>Skills</h3>

          <p>{person.skills}</p>

          <h3>Rate</h3>

          <p>₹{person.rate}/hr</p>

          <button>
            Hire Me →
          </button>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Profile;