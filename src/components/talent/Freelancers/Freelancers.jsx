import { useEffect, useState } from "react";
import FreelancerCard from "../FreelancerCard/FreelancerCard";
import { talentService } from "../../../services/talentService";
import "./Freelancers.css";

function Freelancers() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    let isMounted = true;
    talentService.getFreelancers().then((data) => {
      if (isMounted) {
        setPeople(data.slice(0, 4));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="freelancers">
      <div className="section-heading">
        <p>MEET THE EXPERTS</p>
        <h2>Top freelancers for your next project</h2>
      </div>

      <div className="freelancer-grid">
        {people.map((person) => (
          <FreelancerCard key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}

export default Freelancers;