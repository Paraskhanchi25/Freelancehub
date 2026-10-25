import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Navbar";
import Footer from "../../../components/common/Footer/Footer";
import FreelancerCard from "../../../components/talent/FreelancerCard/FreelancerCard";
import { talentService } from "../../../services/talentService";
import "./FindTalent.css";

function FindTalent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchFromUrl = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchTerm(searchFromUrl);
  }

  useEffect(() => {
    let isMounted = true;
    talentService.getFreelancers().then((data) => {
      if (isMounted) {
        setPeople(data || []);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Distinct roles for filter dropdown
  const roles = useMemo(() => {
    const set = new Set();
    people.forEach((p) => {
      if (p.role) set.add(p.role);
    });
    return Array.from(set);
  }, [people]);

  // Filtered & sorted talent list
  const filteredTalent = useMemo(() => {
    return people
      .filter((person) => {
        const term = searchTerm.toLowerCase().trim();

        if (term) {
          const nameMatch = person.name?.toLowerCase().includes(term);
          const roleMatch = (person.role || person.primarySkill)?.toLowerCase().includes(term);
          const descMatch = person.description?.toLowerCase().includes(term);
          const skillsMatch = Array.isArray(person.skills)
            ? person.skills.some((s) => s.toLowerCase().includes(term))
            : String(person.skills || "").toLowerCase().includes(term);

          if (!nameMatch && !roleMatch && !descMatch && !skillsMatch) {
            return false;
          }
        }

        // Availability filter
        if (availabilityFilter === "available") {
          const isAvail = person.availability?.toLowerCase().includes("avail");
          if (!isAvail) return false;
        }

        // Role filter
        if (roleFilter !== "all" && person.role !== roleFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        }
        if (sortBy === "rate-low") {
          const numA = parseInt(String(a.rate).replace(/[^0-9]/g, ""), 10) || 0;
          const numB = parseInt(String(b.rate).replace(/[^0-9]/g, ""), 10) || 0;
          return numA - numB;
        }
        if (sortBy === "rate-high") {
          const numA = parseInt(String(a.rate).replace(/[^0-9]/g, ""), 10) || 0;
          const numB = parseInt(String(b.rate).replace(/[^0-9]/g, ""), 10) || 0;
          return numB - numA;
        }
        if (sortBy === "projects") {
          return (b.completedProjects || 0) - (a.completedProjects || 0);
        }
        return 0;
      });
  }, [people, searchTerm, availabilityFilter, roleFilter, sortBy]);

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
    setAvailabilityFilter("all");
    setRoleFilter("all");
    setSortBy("rating");
  };

  return (
    <>
      <Navbar />

      <main className="find-talent-page">
        <div className="find-talent-container">
          {/* Header */}
          <div className="find-talent-header">
            <div>
              <span className="page-tag">VERIFIED TALENT</span>
              <h1>Hire Top Freelancers</h1>
              <p>Explore skilled professionals ready to take on your next big project.</p>
            </div>
            <Link to="/post-job" className="btn-header-hire">
              + Post a Job for Matches
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="find-talent-toolbar">
            <div className="search-input-wrap">
              <span className="search-prefix-icon">🔍</span>
              <input
                type="text"
                className="search-field"
                placeholder="Search by name, role (e.g. Designer, Full Stack), or skills..."
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
              {/* Availability Filter */}
              <div className="filter-pills-group">
                <button
                  type="button"
                  className={`pill-btn ${availabilityFilter === "all" ? "active" : ""}`}
                  onClick={() => setAvailabilityFilter("all")}
                >
                  All Talent ({people.length})
                </button>
                <button
                  type="button"
                  className={`pill-btn ${availabilityFilter === "available" ? "active" : ""}`}
                  onClick={() => setAvailabilityFilter("available")}
                >
                  🟢 Available Now ({people.filter((p) => p.availability?.toLowerCase().includes("avail")).length})
                </button>
              </div>

              {/* Roles & Sort Selects */}
              <div className="filter-selects-group">
                {roles.length > 0 && (
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Roles & Specialties</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="rating">Sort by: Top Rated</option>
                  <option value="projects">Most Projects Completed</option>
                  <option value="rate-low">Hourly Rate: Low to High</option>
                  <option value="rate-high">Hourly Rate: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="results-count-bar">
            <span>
              Showing <strong>{filteredTalent.length}</strong> {filteredTalent.length === 1 ? "professional" : "professionals"}
              {searchTerm ? ` matching "${searchTerm}"` : ""}
            </span>
            {(searchTerm || availabilityFilter !== "all" || roleFilter !== "all") && (
              <button type="button" onClick={handleClearFilters} className="btn-reset-filters">
                Reset Filters ↺
              </button>
            )}
          </div>

          {/* Talent Grid */}
          {loading ? (
            <div className="loading-state-card">
              <div className="spinner"></div>
              <p>Loading talent profiles...</p>
            </div>
          ) : filteredTalent.length === 0 ? (
            <div className="empty-state-card">
              <span className="empty-icon">👥</span>
              <h3>No matching professionals found</h3>
              <p>Try searching for different skills or clear your active filters.</p>
              <div className="empty-actions">
                <button type="button" onClick={handleClearFilters} className="btn-empty-reset">
                  Clear All Filters
                </button>
                <Link to="/post-job" className="btn-empty-post">
                  Post a Job Instead
                </Link>
              </div>
            </div>
          ) : (
            <div className="talent-grid">
              {filteredTalent.map((person) => (
                <FreelancerCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default FindTalent;