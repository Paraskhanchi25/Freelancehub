import { useEffect, useRef, useState } from "react";
import "./HowItWorks.css";

function HowItWorks() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const steps = [
    {
      id: 1,
      icon: "📝",
      title: "Post a Project",
      description:
        "Describe what work you need. Add a category, description, budget and location.",
    },
    {
      id: 2,
      icon: "🎯",
      title: "Get Matched",
      description:
        "We analyze your project and recommend suitable freelancers by skills, rating and availability.",
    },
    {
      id: 3,
      icon: "👤",
      title: "Choose the Best Match",
      description:
        "Browse recommended profiles with skills, rating, experience and estimated price.",
    },
    {
      id: 4,
      icon: "💬",
      title: "Get the Work Done",
      description:
        "Message your selected freelancer and track your job from start to finish.",
    },
    {
      id: 5,
      icon: "✅",
      title: "Complete & Review",
      description:
        "Once the project is done, make the payment and leave a rating or review.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="how-it-works" ref={sectionRef}>

      <div className="section-heading">
        <p>SIMPLE PROCESS</p>

        <h2>How FreelanceHub Works</h2>

        <p className="subtext">
          From posting a project to getting it done — in five easy steps.
        </p>
      </div>

      <div className={`steps-row ${visible ? "is-visible" : ""}`}>

        {steps.map((step, index) => (
          <div
            className="step-card"
            key={step.id}
            style={{ transitionDelay: `${index * 0.12}s` }}
          >
            <div className="step-icon">{step.icon}</div>

            <span className="step-number">
              {String(step.id).padStart(2, "0")}
            </span>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

            {index !== steps.length - 1 && (
              <span className="step-arrow">→</span>
            )}
          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;
