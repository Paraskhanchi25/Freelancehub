import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Profile.css";

function Profile() {

  const { id } = useParams();

  const people = [
    {
      id: "1",
      name: "Aarav Sharma",
      role: "UI/UX Designer",
      description: "I create clean and user-friendly digital experiences.",
      skills: "Figma • UI Design • UX Research • Branding",
      rating: "4.9",
      earned: "₹85K",
      rate: "900",
      image: "https://i.pravatar.cc/400?img=12"
    },

    {
      id: "2",
      name: "Ananya Kapoor",
      role: "Full Stack Developer",
      description: "I build fast and modern web applications.",
      skills: "React • Node.js • MongoDB • JavaScript",
      rating: "4.8",
      earned: "₹1.2L",
      rate: "1200",
      image: "https://i.pravatar.cc/400?img=47"
    },

    {
      id: "3",
      name: "Rohan Mehta",
      role: "Graphic Designer",
      description: "I create creative branding and visual designs.",
      skills: "Figma • Photoshop • Illustrator • Branding",
      rating: "4.9",
      earned: "₹72K",
      rate: "700",
      image: "https://i.pravatar.cc/400?img=33"
    },

    {
      id: "4",
      name: "Ishita Verma",
      role: "Content Writer",
      description: "I create engaging content for brands and businesses.",
      skills: "Writing • SEO • Blogs • Social Media",
      rating: "4.7",
      earned: "₹60K",
      rate: "600",
      image: "https://i.pravatar.cc/400?img=44"
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