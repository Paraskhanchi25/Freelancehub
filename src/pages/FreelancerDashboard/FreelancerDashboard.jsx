import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./FreelancerDashboard.css";

function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const appliedJobs = [
    {
      id: "1",
      title: "React Developer",
      client: "TechStart Pvt Ltd",
      budget: "₹8,000",
      applied: "3 days ago",
      status: "Under Review",
    },
    {
      id: "2",
      title: "UI / UX Redesign",
      client: "CreativeAgency",
      budget: "₹6,500",
      applied: "1 week ago",
      status: "Shortlisted",
    },
    {
      id: "3",
      title: "Python API Integration",
      client: "DataCorp",
      budget: "₹12,000",
      applied: "2 weeks ago",
      status: "Rejected",
    },
  ];

  const activeProjects = [
    {
      title: "E-commerce Website",
      client: "Rahul Verma",
      deadline: "Sep 20, 2026",
      progress: 65,
      earnings: "₹8,000",
    },
    {
      title: "Blog Platform",
      client: "Sneha Joshi",
      deadline: "Oct 5, 2026",
      progress: 30,
      earnings: "₹5,000",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="dashboard-layout">

        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Freelancer"
            />
            <h3>Aarav Mehta</h3>
            <p>Full Stack Developer</p>
          </div>

          <nav className="sidebar-nav">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={activeTab === "projects" ? "active" : ""}
              onClick={() => setActiveTab("projects")}
            >
              🚀 Active Projects
            </button>
            <button
              className={activeTab === "applied" ? "active" : ""}
              onClick={() => setActiveTab("applied")}
            >
              📋 Applied Jobs
            </button>
            <button
              className={activeTab === "earnings" ? "active" : ""}
              onClick={() => setActiveTab("earnings")}
            >
              💰 Earnings
            </button>
          </nav>

          <Link to="/find-work" className="sidebar-cta">
            🔍 Browse Jobs
          </Link>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">

          {activeTab === "overview" && (
            <div>
              <h1>Welcome back, Aarav 👋</h1>
              <p className="dash-subtitle">Here&apos;s your freelancing snapshot.</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>2</span>
                  <p>Active Projects</p>
                </div>
                <div className="stat-card">
                  <span>3</span>
                  <p>Applications Sent</p>
                </div>
                <div className="stat-card">
                  <span>₹34,500</span>
                  <p>Total Earned</p>
                </div>
                <div className="stat-card">
                  <span>4.8 ⭐</span>
                  <p>Avg Rating</p>
                </div>
              </div>

              <h2 className="section-title">Active Projects</h2>
              {activeProjects.map((p) => (
                <div className="project-progress-card" key={p.title}>
                  <div className="project-progress-top">
                    <div>
                      <h3>{p.title}</h3>
                      <p>Client: {p.client} · Due: {p.deadline}</p>
                    </div>
                    <strong>{p.earnings}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <p className="progress-label">{p.progress}% complete</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <h1>Active Projects</h1>
              <p className="dash-subtitle">Track progress on your ongoing work.</p>
              {activeProjects.map((p) => (
                <div className="project-progress-card" key={p.title}>
                  <div className="project-progress-top">
                    <div>
                      <h3>{p.title}</h3>
                      <p>Client: {p.client} · Due: {p.deadline}</p>
                    </div>
                    <strong>{p.earnings}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <p className="progress-label">{p.progress}% complete</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "applied" && (
            <div>
              <h1>Applied Jobs</h1>
              <p className="dash-subtitle">Track the status of your job applications.</p>
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Job Title</span>
                  <span>Client</span>
                  <span>Budget</span>
                  <span>Applied</span>
                  <span>Status</span>
                </div>
                {appliedJobs.map((job) => (
                  <div className="dash-table-row" key={job.id}>
                    <span>{job.title}</span>
                    <span>{job.client}</span>
                    <span>{job.budget}</span>
                    <span>{job.applied}</span>
                    <span
                      className={`status-badge ${
                        job.status === "Shortlisted"
                          ? "active"
                          : job.status === "Rejected"
                          ? "closed"
                          : "pending"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "earnings" && (
            <div>
              <h1>Earnings</h1>
              <p className="dash-subtitle">Your income from completed projects.</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>₹34,500</span>
                  <p>Total Earned</p>
                </div>
                <div className="stat-card">
                  <span>₹13,000</span>
                  <p>This Month</p>
                </div>
                <div className="stat-card">
                  <span>8</span>
                  <p>Projects Done</p>
                </div>
              </div>

              <div className="dash-table" style={{ marginTop: "30px" }}>
                <div className="dash-table-head">
                  <span>Project</span>
                  <span>Client</span>
                  <span>Amount</span>
                  <span>Date</span>
                </div>
                <div className="dash-table-row">
                  <span>E-commerce Website</span>
                  <span>Rahul Verma</span>
                  <span>₹8,000</span>
                  <span>Aug 25, 2026</span>
                </div>
                <div className="dash-table-row">
                  <span>Mobile App UI</span>
                  <span>Sneha Joshi</span>
                  <span>₹5,000</span>
                  <span>Aug 10, 2026</span>
                </div>
                <div className="dash-table-row">
                  <span>Blog Platform</span>
                  <span>Amit Patel</span>
                  <span>₹7,500</span>
                  <span>Jul 22, 2026</span>
                </div>
                <div className="dash-table-row">
                  <span>Dashboard Design</span>
                  <span>DataCorp</span>
                  <span>₹7,000</span>
                  <span>Jul 5, 2026</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  );
}

export default FreelancerDashboard;
