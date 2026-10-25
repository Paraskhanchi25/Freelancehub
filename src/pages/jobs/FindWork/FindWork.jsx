import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import JobCard from "../../../components/jobs/JobCard/JobCard";
import { jobService } from "../../../services/jobService";
import "./FindWork.css";

function FindWork() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchTerm(searchFromUrl);
  }

  useEffect(() => {
    let isMounted = true;
    jobService.getJobs().then((data) => {
      if (isMounted) {
        setJobs(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return Array.from(set);
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const term = searchTerm.toLowerCase().trim();

        // Keyword Match
        if (term) {
          const titleMatch = job.title?.toLowerCase().includes(term);
          const descMatch = job.description?.toLowerCase().includes(term);
          const catMatch = job.category?.toLowerCase().includes(term);
          const skillsMatch = Array.isArray(job.skills)
            ? job.skills.some((s) => s.toLowerCase().includes(term))
            : String(job.skills || "").toLowerCase().includes(term);

          if (!titleMatch && !descMatch && !catMatch && !skillsMatch) {
            return false;
          }
        }

        // Status Match
        if (statusFilter === "active" && job.status?.toLowerCase() !== "active") {
          return false;
        }
        if (statusFilter === "closed" && job.status?.toLowerCase() !== "closed") {
          return false;
        }

        // Category Match
        if (selectedCategory !== "all" && job.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "budget-high") {
          const numA = parseInt(String(a.budget).replace(/[^0-9]/g, ""), 10) || 0;
          const numB = parseInt(String(b.budget).replace(/[^0-9]/g, ""), 10) || 0;
          return numB - numA;
        }
        if (sortBy === "budget-low") {
          const numA = parseInt(String(a.budget).replace(/[^0-9]/g, ""), 10) || 0;
          const numB = parseInt(String(b.budget).replace(/[^0-9]/g, ""), 10) || 0;
          return numA - numB;
        }
        // Newest
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [jobs, searchTerm, statusFilter, selectedCategory, sortBy]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchParams({});
    setStatusFilter("all");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  return (
    <>
      <Navbar />

      <main className="find-work-page">
        <div className="find-work-container">
          {/* Header Banner */}
          <div className="find-work-header">
            <div>
              <span className="page-tag">EXPLORE WORK</span>
              <h1>Find Freelance Projects</h1>
              <p>Discover real-time verified projects across development, design, and marketing.</p>
            </div>
            <Link to="/post-job" className="btn-header-post">
              + Post a Project
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="find-work-toolbar">
            <div className="search-input-wrap">
              <span className="search-prefix-icon">🔍</span>
              <input
                type="text"
                className="search-field"
                placeholder="Search by job title, skill (e.g. React, Python), or keywords..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => handleSearchChange("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-controls-row">
              {/* Status Filter Pills */}
              <div className="filter-pills-group">
                <button
                  type="button"
                  className={`pill-btn ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All Statuses ({jobs.length})
                </button>
                <button
                  type="button"
                  className={`pill-btn ${statusFilter === "active" ? "active" : ""}`}
                  onClick={() => setStatusFilter("active")}
                >
                  Active ({jobs.filter((j) => j.status?.toLowerCase() === "active").length})
                </button>
                <button
                  type="button"
                  className={`pill-btn ${statusFilter === "closed" ? "active" : ""}`}
                  onClick={() => setStatusFilter("closed")}
                >
                  Closed ({jobs.filter((j) => j.status?.toLowerCase() === "closed").length})
                </button>
              </div>

              {/* Category & Sorting Selects */}
              <div className="filter-selects-group">
                {categories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="budget-high">Budget: High to Low</option>
                  <option value="budget-low">Budget: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="results-count-bar">
            <span>
              Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? "project" : "projects"}
              {searchTerm ? ` for "${searchTerm}"` : ""}
            </span>
            {(searchTerm || statusFilter !== "all" || selectedCategory !== "all") && (
              <button type="button" onClick={handleClearFilters} className="btn-reset-filters">
                Reset Filters ↺
              </button>
            )}
          </div>

          {/* Jobs Listing Grid */}
          {loading ? (
            <div className="loading-state-card">
              <div className="spinner"></div>
              <p>Loading projects from database...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state-card">
              <span className="empty-icon">📂</span>
              <h3>No matching projects found</h3>
              <p>Try searching with different keywords, removing filters, or be the first to post a new job!</p>
              <div className="empty-actions">
                <button type="button" onClick={handleClearFilters} className="btn-empty-reset">
                  Clear All Filters
                </button>
                <Link to="/post-job" className="btn-empty-post">
                  + Post a Job
                </Link>
              </div>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default FindWork;