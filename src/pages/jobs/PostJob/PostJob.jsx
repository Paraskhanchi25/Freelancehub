import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import ImageUpload from "../../../components/common/ImageUpload/ImageUpload";
import { jobService } from "../../../services/jobService";
import { proposalService } from "../../../services/proposalService";
import { useAuth } from "../../../context/useAuth";
import "./PostJob.css";

function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const targetFreelancer = location.state?.targetFreelancer;
  const targetFreelancerId = location.state?.targetFreelancerId;
  const suggestedRate = location.state?.suggestedRate;
  const initialCategory = location.state?.category || "Web Development";

  const [formData, setFormData] = useState(() => ({
    title: targetFreelancer ? `Project with ${targetFreelancer}` : "",
    category: initialCategory,
    description: "",
    skills: "",
    budget: suggestedRate ? String(suggestedRate).replace(/[^0-9]/g, "") : "",
    client: user?.name || "Client User",
    status: "Active",
    image: "",
  }));

  const [loading, setLoading] = useState(false);
  const [successJob, setSuccessJob] = useState(null);
  const [error, setError] = useState("");
  const [hiringDirectly, setHiringDirectly] = useState(false);
  const [directHiredSuccess, setDirectHiredSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (newImage) => {
    setFormData((prev) => ({ ...prev, image: newImage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please fill in both the title and description.");
      return;
    }

    try {
      setLoading(true);
      const newJob = await jobService.createJob({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        budget: formData.budget,
        client: user?.name || formData.client || "Client",
        clientId: user?.id || "",
        clientEmail: user?.email || "",
        clientAvatar: user?.avatar || "",
        status: formData.status,
        image: formData.image || "",
      });

      setSuccessJob(newJob);
    } catch {
      setError("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectHire = async () => {
    if (!successJob || !targetFreelancerId) return;
    setHiringDirectly(true);
    try {
      await proposalService.createProposal({
        jobId: successJob.id,
        jobTitle: successJob.title,
        clientId: user?.id || "",
        clientEmail: user?.email || "",
        freelancerId: targetFreelancerId,
        freelancerName: targetFreelancer,
        freelancerEmail: `${targetFreelancer.toLowerCase().replace(/\s+/g, "")}@example.com`,
        freelancerAvatar: "",
        freelancerRole: successJob.category,
        bidAmount: successJob.budget || "5,000",
        estimatedDays: "5-7 days",
        coverLetter: `Direct hire offer from ${user?.name || "Client"} for project: "${successJob.title}".`,
        status: "Hired",
      });
      setDirectHiredSuccess(true);
    } catch (err) {
      console.error("Direct hire creation failed:", err);
      setError("Job was created, but failed to automatically link contract. You can hire from the dashboard.");
    } finally {
      setHiringDirectly(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="post-job">
        <div className="post-job-card">
          <h1>{targetFreelancer ? `Post Job for ${targetFreelancer}` : "Post a Job"}</h1>
          <p className="post-job-subtitle">
            {targetFreelancer
              ? `Create a project posting specifically tailored to hire ${targetFreelancer}.`
              : "Create a new freelance opportunity and attract top verified professionals."}
          </p>

          {targetFreelancer && (
            <div className="target-freelancer-card">
              <span className="target-badge">🎯 Direct Hire Mode</span>
              <p className="target-info">
                You are creating this project for <strong>{targetFreelancer}</strong>. Once published, you can finalize their hire contract immediately.
              </p>
            </div>
          )}

          {error && <div className="error-banner">{error}</div>}

          {successJob ? (
            directHiredSuccess ? (
              <div className="success-banner direct-hired-banner">
                <h3>🎉 Contract Finalized with {targetFreelancer}!</h3>
                <p>
                  The project <strong>&quot;{successJob.title}&quot;</strong> is live and <strong>{targetFreelancer}</strong> has been added to your active contracts.
                </p>
                <div className="success-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate("/client-dashboard")}
                  >
                    View in Client Dashboard →
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate(`/job-details/${successJob.id}`)}
                  >
                    View Project Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="success-banner">
                <h3>🎉 Job Posted Successfully!</h3>
                <p>Your job &quot;{successJob.title}&quot; has been created and saved into the database.</p>

                {targetFreelancerId && (
                  <div className="direct-hire-prompt">
                    <p>
                      Ready to hire <strong>{targetFreelancer}</strong> for this project?
                    </p>
                    <button
                      type="button"
                      className="btn-hire-now"
                      onClick={handleDirectHire}
                      disabled={hiringDirectly}
                    >
                      {hiringDirectly ? "Issuing Contract..." : `🤝 Officially Hire ${targetFreelancer} Now`}
                    </button>
                  </div>
                )}

                <div className="success-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate(`/job-details/${successJob.id}`)}
                  >
                    View Job Details →
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate(`/blueprint?jobId=${successJob.id}`)}
                    style={{ background: "#4f46e5", color: "#fff", borderColor: "#4338ca" }}
                  >
                    ⚡ Generate AI Architecture Blueprint
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate("/client-dashboard")}
                  >
                    Manage in Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => {
                      setSuccessJob(null);
                      setDirectHiredSuccess(false);
                    }}
                  >
                    + Post Another Job
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              <div className="post-job-ai-helper">
                <div className="ai-helper-text">
                  <strong>✨ Need technical architecture or specifications for this project?</strong>
                  <p>Use our Gemini 3.8 Flash Blueprint Studio to generate system designs, data flows, database schemas, and downloadable PDFs.</p>
                </div>
                <Link to="/blueprint" className="btn-ai-helper">
                  ⚡ Open AI Blueprint Studio
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="post-job-form">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Senior React Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Cover Image Upload Component */}
              <ImageUpload
                value={formData.image}
                onChange={handleImageChange}
                label="Project Cover / Banner Image (Optional)"
              />

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="UI/UX & Design">UI/UX & Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Video Editing">Video Editing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Budget (₹) *</label>
                  <input
                    id="budget"
                    type="text"
                    name="budget"
                    placeholder="e.g. 15,000"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Project Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Detail the deliverables, timeline, expectations, and tech stack required..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="skills">Required Skills (comma separated) *</label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  placeholder="e.g. React, TypeScript, Tailwind CSS, REST APIs"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
                <small className="help-text">Separate skills with commas</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="client">Client / Company Name</label>
                  <input
                    id="client"
                    type="text"
                    name="client"
                    placeholder="Your Name or Company"
                    value={formData.client}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Initial Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active (Accepting Proposals)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? "Publishing Project..." : "Post Job (Create) →"}
                </button>
                <Link to="/find-work" className="btn-cancel">
                  Cancel
                </Link>
              </div>
            </form>
          </>
        )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default PostJob;