import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import ImageUpload from "../../../components/common/ImageUpload/ImageUpload";
import { jobService } from "../../../services/jobService";
import "./EditJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    description: "",
    skills: "",
    budget: "",
    client: "Himakshi",
    status: "Active",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    jobService.getJobById(id).then((job) => {
      if (isMounted) {
        if (job) {
          setFormData({
            title: job.title || "",
            category: job.category || "Web Development",
            description: job.description || "",
            skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
            budget: job.budget || "",
            client: job.client || "Client",
            status: job.status || "Active",
            image: job.image || "",
          });
        } else {
          setError("Job not found in JSON data.");
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please fill in both the title and description.");
      return;
    }

    try {
      setSaving(true);
      await jobService.updateJob(id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        budget: formData.budget,
        client: formData.client,
        status: formData.status,
        image: formData.image || "",
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/job-details/${id}`);
      }, 1200);
    } catch {
      setError("Failed to update job in JSON file. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (newImage) => {
    setFormData((prev) => ({ ...prev, image: newImage }));
  };

  return (
    <>
      <Navbar />

      <section className="edit-job">
        <div className="edit-job-card">
          <div className="edit-job-header">
            <Link to={`/job-details/${id}`} className="back-link">
              ← Back to Job Details
            </Link>
            <h1>Edit Job (Update)</h1>
            <p className="edit-job-subtitle">
              Modify this project posting. Changes are written directly back to <code>data/jobs.json</code>.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading job data from JSON...</p>
            </div>
          ) : error && !formData.title ? (
            <div className="error-banner">
              {error}
              <div style={{ marginTop: "15px" }}>
                <Link to="/find-work" className="btn-cancel">
                  Back to Find Work
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-job-form">
              {error && <div className="error-banner">{error}</div>}

              {success && (
                <div className="success-banner">
                  <h3>✅ Job Updated Successfully!</h3>
                  <p>Changes saved to <code>data/jobs.json</code>. Redirecting...</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
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
                    value={formData.client}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Job Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active (Open for Proposals)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={saving || success} className="btn-submit">
                  {saving ? "Saving Changes..." : "Save Changes (Update) →"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate(`/job-details/${id}`)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default EditJob;
