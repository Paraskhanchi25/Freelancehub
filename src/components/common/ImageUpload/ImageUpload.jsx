import { useState, useRef } from "react";
import "./ImageUpload.css";

const PRESET_COVERS = [
  {
    name: "Web & Tech",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    icon: "💻",
  },
  {
    name: "UI/UX Design",
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    icon: "🎨",
  },
  {
    name: "Mobile Apps",
    url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
    icon: "📱",
  },
  {
    name: "Data & Cloud",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    icon: "☁️",
  },
  {
    name: "Marketing",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    icon: "📈",
  },
  {
    name: "Creative & Writing",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    icon: "✍️",
  },
];

function ImageUpload({ value, onChange, label = "Project Cover Image (Optional)" }) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Check mime type
    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }

    // Check size limit: 2MB
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image file size is too large (max 2MB). Please select a smaller image or use a preset cover.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      onChange(uploadEvent.target.result);
    };
    reader.onerror = () => {
      setFileError("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setUrlInputValue("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-wrapper">
      <div className="image-upload-label-bar">
        <label className="image-upload-label">{label}</label>
        {value && (
          <button
            type="button"
            className="btn-remove-image"
            onClick={handleRemove}
            title="Remove cover image"
          >
            ✕ Remove Image
          </button>
        )}
      </div>

      {fileError && <div className="image-upload-error">{fileError}</div>}

      {/* Image Preview Box */}
      {value ? (
        <div className="image-preview-card">
          <img
            src={value}
            alt="Job preview"
            className="image-preview-img"
            onError={() => setFileError("Failed to load image preview. The link may be broken.")}
          />
          <div className="image-preview-overlay">
            <span className="image-preview-tag">✓ Cover Selected</span>
            <button
              type="button"
              className="btn-change-image"
              onClick={() => fileInputRef.current?.click()}
            >
              🔄 Change File
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          className="image-dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon">🖼️</div>
          <p className="dropzone-title">
            <strong>Click to upload</strong> an image from your computer
          </p>
          <p className="dropzone-sub">Supports PNG, JPG, WebP, GIF (Max 2MB)</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Quick Preset Selector & URL Toggle */}
      <div className="image-presets-section">
        <span className="presets-title">Or pick a curated cover:</span>
        <div className="preset-chips-list">
          {PRESET_COVERS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={`preset-chip ${value === preset.url ? "preset-chip-active" : ""}`}
              onClick={() => onChange(preset.url)}
            >
              <span className="preset-icon">{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="image-url-toggle-bar">
          {!showUrlInput ? (
            <button
              type="button"
              className="btn-toggle-url"
              onClick={() => setShowUrlInput(true)}
            >
              🔗 Paste Image URL instead
            </button>
          ) : (
            <div className="image-url-input-group">
              <input
                type="url"
                placeholder="https://example.com/cover-image.jpg"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyUrl())}
                className="url-input-field"
              />
              <button
                type="button"
                className="btn-apply-url"
                onClick={handleApplyUrl}
              >
                Apply
              </button>
              <button
                type="button"
                className="btn-cancel-url"
                onClick={() => setShowUrlInput(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
