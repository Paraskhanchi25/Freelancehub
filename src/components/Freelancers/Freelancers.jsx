import FreelancerCard from "../FreelancerCard/FreelancerCard";
import "./Freelancers.css";


function Freelancers() {

  const people = [

    
    {
      id: 1,
      name: "Somya",
      role: "UI/UX Designer",
      description: "I create clean and user-friendly digital experiences.",
      rating: "4.9",
      earned: "₹85K",
      rate: "900",
      image: "../../src/assets/somya.jpeg"
    },

    {
      id: 2,
      name: "Tushar Bansal",
      role: "Full Stack Developer",
      description: "I build fast and modern web applications.",
      rating: "4.8",
      earned: "₹1.2L",
      rate: "1200",
      image: "../../src/assets/Tushar.jpeg"
    },

    {
      id: 3,
      name: "Himakshi",
      role: "Graphic Designer",
      description: "Branding, posters and creative visual designs.",
      rating: "4.9",
      earned: "₹72K",
      rate: "700",
      image: "https://i.pravatar.cc/400?img=33"
    },

    {
      id: 4,
      name: "Paras",
      role: "Content Writer",
      description: "Creative content that connects brands with people.",
      rating: "4.7",
      earned: "₹60K",
      rate: "600",
      image: "../../src/assets/Myself.jpeg"
    }
  ];

  return (
    <section className="freelancers">

      <div className="section-heading">
        <p>MEET THE EXPERTS</p>

        <h2>
          Top freelancers for your next project
        </h2>
      </div>

      <div className="freelancer-grid">

        {people.map((person) => (
          <FreelancerCard
            key={person.id}
            person={person}
          />
        ))}

      </div>

    </section>
  );
}

export default Freelancers;