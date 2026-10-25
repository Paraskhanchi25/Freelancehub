import { useEffect, useState } from "react";
import "./MotivationalQuotes.css";

const quotes = [
  "Great things are built by people who start.",
  "Your skills can create opportunities.",
  "Every project is a chance to grow.",
  "Turn your skills into meaningful work.",
  "The right opportunity can change everything.",
  "Start small. Work hard. Build something great.",
  "Your next opportunity could be one project away.",
];

function MotivationalQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="motivational-quotes">

      <div className="quotes-overlay">

        <p className="quotes-label">A LITTLE INSPIRATION</p>

        <div className="quote-display">
          {quotes.map((quote, i) => (
            <blockquote
              key={quote}
              className={i === index ? "active" : ""}
            >
              “{quote}”
            </blockquote>
          ))}
        </div>

        <div className="quote-dots">
          {quotes.map((quote, i) => (
            <button
              key={quote}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Show quote ${i + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}

export default MotivationalQuotes;
