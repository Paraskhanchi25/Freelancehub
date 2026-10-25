import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import "./CompleteProfile.css";

export default function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditing = location.state?.isEditing || false;
  const isFreelancer = user?.role === "freelancer";

  // Form State initialized from user
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [title, setTitle] = useState(user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || ""
  );
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || "");
  const [experience, setExperience] = useState(user?.experience || "2 yrs");
  const [availability, setAvailability] = useState(user?.availability || "Available now");
  const [locationStr, setLocationStr] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [company, setCompany] = useState(user?.company || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Handle local image file upload & downscale/compress to lightweight base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please choose an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Resize to max 256x256 while preserving aspect ratio
          const maxDim = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Highly optimized JPEG data URL (~15-25 KB)
          const compressed = canvas.toDataURL("image/jpeg", 0.82);
          setAvatar(compressed);
        } catch {
          // Fallback if canvas has error
          setAvatar(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedData = {
      avatar,
      title: title.trim(),
      bio: bio.trim(),
      location: locationStr.trim(),
      website: website.trim(),
      phone: phone.trim(),
      profileCompleted: true, // Marked as completed!
    };

    if (isFreelancer) {
      updatedData.skills = skillsArray;
      updatedData.hourlyRate = hourlyRate.trim();
      updatedData.experience = experience;
      updatedData.availability = availability;
    } else {
      updatedData.company = company.trim() || user?.name || "Independent Client";
    }

    try {
      await updateProfile(updatedData);
      setToast("Profile successfully saved!");
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin-dashboard");
        } else if (isFreelancer) {
          navigate("/freelancer-dashboard");
        } else {
          navigate("/client-dashboard");
        }
      }, 900);
    } catch (err) {
      alert("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    // If they skip, mark profileCompleted as false
    await updateProfile({ profileCompleted: false });
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (isFreelancer) {
      navigate("/freelancer-dashboard");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <>
      <Navbar />

      <div className="onboarding-page">
        <div className="onboarding-card">
          {toast && <div className="onboarding-toast">✅ {toast}</div>}

          <div className="onboarding-header">
            <span className="step-badge">
              {isEditing ? "EDIT PROFILE" : "STEP 2 OF 2: PROFILE SETUP"}
            </span>
            <h1>
              {isEditing
                ? "Update Your Profile"
                : `Welcome, ${user?.name || "Member"}!`}
            </h1>
            <p>
              {isEditing
                ? "Modify your public profile and dashboard information."
                : `Complete your ${isFreelancer ? "freelancer" : "client"} profile so others know what you do.`}
            </p>
          </div>

          <form onSubmit={handleSave} className="onboarding-form">
            {/* Avatar Section */}
            <div className="avatar-upload-section">
              <div className="avatar-preview-wrap">
                {avatar ? (
                  <img src={avatar} alt="Profile Preview" className="avatar-preview-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "👤"}
                  </div>
                )}
              </div>

              <div className="avatar-controls">
                <label className="btn-upload">
                  📸 Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                  />
                </label>
                {avatar && (
                  <button
                    type="button"
                    className="btn-remove-photo"
                    onClick={() => setAvatar("")}
                  >
                    Remove
                  </button>
                )}
                <small className="avatar-hint">
                  Supports JPG, PNG or WebP. Max 2MB.
                </small>
              </div>
            </div>

            {/* Role-Specific Fields */}
            {isFreelancer ? (
              <>
                <div className="form-group">
                  <label htmlFor="title">Professional Headline / Title *</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Senior React & Full Stack Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="hourlyRate">Hourly Rate (₹ / hr) *</label>
                    <input
                      id="hourlyRate"
                      type="number"
                      placeholder="e.g. 1000"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      min="100"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">Experience Level</label>
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <option value="1 yr">1 Year (Junior)</option>
                      <option value="2 yrs">2 Years (Mid-level)</option>
                      <option value="3 yrs">3 Years (Mid-level)</option>
                      <option value="5+ yrs">5+ Years (Senior / Expert)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Primary Skills (comma separated) *</label>
                  <input
                    id="skills"
                    type="text"
                    placeholder="e.g. React, Node.js, TypeScript, UI/UX, REST APIs"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                  />
                  <small className="form-hint">
                    Separate each skill with a comma to create tags.
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Professional Bio & Overview *</label>
                  <textarea
                    id="bio"
                    rows="4"
                    placeholder="Describe your technical background, past accomplishments, and what clients can expect when working with you..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="location">City / Location</label>
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g. Chandigarh, India or Remote"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="Available now">Available now (Full-time)</option>
                      <option value="Part-time">Available part-time</option>
                      <option value="Busy till Fri">Busy till Friday</option>
                      <option value="Not taking work">Not currently available</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="website">GitHub / Portfolio Website</label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone / WhatsApp (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Client Fields */
              <>
                <div className="form-group">
                  <label htmlFor="company">Company / Organization Name *</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="e.g. Bansal Enterprises or Self-Employed"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Your Role / Job Title</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g. Founder, Product Manager, Director"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Headquarters / City</label>
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g. Bangalore, India"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">About Your Organization</label>
                  <textarea
                    id="bio"
                    rows="3"
                    placeholder="Briefly describe what your organization does and the types of freelancers or contractors you hire..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="website">Company Website</label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Contact Phone (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="onboarding-actions">
              <button
                type="submit"
                disabled={saving}
                className="btn-save-onboarding"
              >
                {saving ? "Saving Details..." : "Save & Go to Dashboard →"}
              </button>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="btn-skip-onboarding"
                >
                  Skip for now →
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
