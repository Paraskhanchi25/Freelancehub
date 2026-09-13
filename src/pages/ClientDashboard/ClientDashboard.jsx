import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./ClientDashboard.css";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const postedJobs = [
    {
      id: "1",
      title: "React Developer",
      budget: "8,000",
      proposals: 12,
      status: "Active",
      posted: "2 days ago",
    },
    {
      id: "2",
      title: "Graphic Designer",
      budget: "5,000",
      proposals: 7,
      status: "Active",
      posted: "5 days ago",
    },
    {
      id: "3",
      title: "Python Developer",
      budget: "10,000",
      proposals: 3,
      status: "Closed",
      posted: "10 days ago",
    },
  ];

  const hiredFreelancers = [
    {
      name: "Aarav Mehta",
      role: "React Developer",
      project: "E-commerce Website",
      status: "In Progress",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Sharma",
      role: "UI Designer",
      project: "Mobile App UI",
      status: "Completed",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
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
              src="./src/assets/Somyaa.jpeg"
              alt="Client"
            />
            <h3>Himakshi</h3>
            <p>Client Account</p>
          </div>

          <nav className="sidebar-nav">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={activeTab === "jobs" ? "active" : ""}
              onClick={() => setActiveTab("jobs")}
            >
              💼 My Jobs
            </button>
            <button
              className={activeTab === "hired" ? "active" : ""}
              onClick={() => setActiveTab("hired")}
            >
              👥 Hired
            </button>
            <button
              className={activeTab === "payments" ? "active" : ""}
              onClick={() => setActiveTab("payments")}
            >
              💳 Payments
            </button>
          </nav>

          <Link to="/post-job" className="sidebar-cta">
            + Post a Job
          </Link>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">

          {activeTab === "overview" && (
            <div>
              <h1>Welcome back, Himakshi</h1>
              <p className="dash-subtitle">Here&apos;s what&apos;s happening with your projects.</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>3</span>
                  <p>Jobs Posted</p>
                </div>
                <div className="stat-card">
                  <span>22</span>
                  <p>Total Proposals</p>
                </div>
                <div className="stat-card">
                  <span>2</span>
                  <p>Active Hires</p>
                </div>
                <div className="stat-card">
                  <span>₹23,000</span>
                  <p>Total Spent</p>
                </div>
              </div>

              <h2 className="section-title">Recent Jobs</h2>
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Job Title</span>
                  <span>Budget</span>
                  <span>Proposals</span>
                  <span>Status</span>
                </div>
                {postedJobs.map((job) => (
                  <div className="dash-table-row" key={job.id}>
                    <span>{job.title}</span>
                    <span>₹{job.budget}</span>
                    <span>{job.proposals}</span>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div>
              <h1>My Posted Jobs</h1>
              <p className="dash-subtitle">Manage all your job postings here.</p>
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Job Title</span>
                  <span>Budget</span>
                  <span>Proposals</span>
                  <span>Posted</span>
                  <span>Status</span>
                </div>
                {postedJobs.map((job) => (
                  <div className="dash-table-row" key={job.id}>
                    <span>{job.title}</span>
                    <span>₹{job.budget}</span>
                    <span>{job.proposals}</span>
                    <span>{job.posted}</span>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hired" && (
            <div>
              <h1>Hired Freelancers</h1>
              <p className="dash-subtitle">Track the people working on your projects.</p>
              <div className="hired-grid">
                {hiredFreelancers.map((f) => (
                  <div className="hired-card" key={f.name}>
                    <img src={f.img} alt={f.name} />
                    <div>
                      <h3>{f.name}</h3>
                      <p className="hired-role">{f.role}</p>
                      <p className="hired-project">{f.project}</p>
                      <span className={`status-badge ${f.status === "Completed" ? "closed" : "active"}`}>
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <h1>Payment History</h1>
              <p className="dash-subtitle">Review your transactions.</p>
              <div className="dash-table">
                <div className="dash-table-head">
                  <span>Freelancer</span>
                  <span>Project</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                <div className="dash-table-row">
                  <span>Aarav Mehta</span>
                  <span>E-commerce Website</span>
                  <span>₹8,000</span>
                  <span>Aug 20, 2026</span>
                  <span className="status-badge active">Paid</span>
                </div>
                <div className="dash-table-row">
                  <span>Priya Sharma</span>
                  <span>Mobile App UI</span>
                  <span>₹5,000</span>
                  <span>Aug 10, 2026</span>
                  <span className="status-badge closed">Pending</span>
                </div>
                <div className="dash-table-row">
                  <span>Rohan Das</span>
                  <span>Python Script</span>
                  <span>₹10,000</span>
                  <span>Jul 30, 2026</span>
                  <span className="status-badge active">Paid</span>
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

export default ClientDashboard;
