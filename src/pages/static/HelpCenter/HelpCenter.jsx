import { useState } from "react";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import "./HelpCenter.css";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account on FreelanceHub?",
        a: "Click 'Sign Up' in the top-right corner, fill in your details, and choose whether you're joining as a freelancer or client. It takes less than 2 minutes.",
      },
      {
        q: "Is FreelanceHub free to join?",
        a: "Yes, creating an account is completely free for both freelancers and clients. We only charge a small platform fee when a project is successfully completed.",
      },
      {
        q: "What is the difference between a client and freelancer account?",
        a: "Clients post jobs and hire talent. Freelancers browse jobs, submit proposals, and complete projects to earn money.",
      },
    ],
  },
  {
    category: "For Freelancers",
    questions: [
      {
        q: "How do I apply for a job?",
        a: "Browse jobs on the Find Work page, click any listing to see details, and submit your proposal with your rate and a brief pitch.",
      },
      {
        q: "When do I get paid?",
        a: "Payments are released within 3 business days after the client marks the project as complete.",
      },
      {
        q: "How do I improve my profile?",
        a: "Add a professional photo, write a clear bio, list all your skills, and include past project examples. A complete profile gets 3x more views.",
      },
    ],
  },
  {
    category: "For Clients",
    questions: [
      {
        q: "How do I post a job?",
        a: "Go to 'Post a Job', fill in the title, description, required skills, and your budget. Your listing goes live instantly.",
      },
      {
        q: "How do I choose the right freelancer?",
        a: "Review proposals, check freelancer profiles and ratings, and shortlist candidates. You can message them before hiring.",
      },
      {
        q: "What if I'm not happy with the work?",
        a: "We offer a dispute resolution process. Reach out to our support team and we'll mediate between you and the freelancer.",
      },
    ],
  },
  {
    category: "Payments & Billing",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI, net banking, debit/credit cards, and major digital wallets.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all transactions are encrypted and processed through PCI-DSS compliant payment gateways.",
      },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqs.map((f) => f.category)];

  const filtered = faqs
    .filter((section) =>
      activeCategory === "All" ? true : section.category === activeCategory
    )
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        (item) =>
          search === "" ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="help-hero">
        <h1>Help Center</h1>
        <p>Find answers to your questions about FreelanceHub.</p>
        <div className="help-search">
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Quick Links */}
      <section className="help-quick">
        <div className="help-quick-grid">
          <div className="help-quick-card">
            <span>🚀</span>
            <h3>Getting Started</h3>
            <p>New to FreelanceHub? Learn the basics.</p>
          </div>
          <div className="help-quick-card">
            <span>💼</span>
            <h3>Finding Work</h3>
            <p>Tips for freelancers to land projects.</p>
          </div>
          <div className="help-quick-card">
            <span>👥</span>
            <h3>Hiring Talent</h3>
            <p>How to find and work with freelancers.</p>
          </div>
          <div className="help-quick-card">
            <span>💳</span>
            <h3>Payments</h3>
            <p>Everything about billing and payouts.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="help-faq">

        {/* Category Filter */}
        <div className="faq-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="no-results">No results found for &quot;{search}&quot;. Try a different keyword.</p>
        )}

        {filtered.map((section) => (
          <div className="faq-section" key={section.category}>
            <h2>{section.category}</h2>
            {section.questions.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        ))}
      </section>

      {/* Contact Strip */}
      <section className="help-contact">
        <h2>Still need help?</h2>
        <p>Our support team is available Monday – Saturday, 9am – 6pm IST.</p>
        <a href="mailto:support@freelancehub.com" className="help-contact-btn">
          📧 Email Support
        </a>
      </section>

      <Footer />
    </>
  );
}

export default HelpCenter;
