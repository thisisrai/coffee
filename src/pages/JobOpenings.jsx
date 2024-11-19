import { useEffect, useState } from "react";
import "../styles/JobOpenings.css";

const JobOpenings = () => {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [company, setCompany] = useState("");

  const fetchOpenings = async () => {
    setLoading(true);
    try {
      const url = new URL("https://jobrepo.onrender.com/openings/paginated");
      url.searchParams.append("page", currentPage);
      if (location) url.searchParams.append("location", location.trim());
      if (occupation) url.searchParams.append("title", occupation.trim());
      if (company) url.searchParams.append("company", company);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      const data = result.data || result;
      const totalPages =
        Math.ceil(result.total_count / 50) || Math.ceil(data.length / 50);

      setOpenings(data || []);
      if (totalPages === 0) {
        setCurrentPage(0);
      }
      setTotalPages(totalPages);
    } catch (error) {
      setError(error);
      console.error("Error fetching openings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchOpenings();
  }, [currentPage, company]); // Fetch openings whenever currentPage changes

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    fetchOpenings();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="job-openings">
      <h1>Job Openings</h1>
      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search by occupation (e.g., engineer)"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        {company && (
          <button className="company-filter-tag" onClick={() => setCompany("")}>
            {company} ×
          </button>
        )}
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <ul>
        {openings.length > 0 ? (
          openings.map((opening) => (
            <li key={opening.id} className="job-opening-card">
              <h3>{opening.title}</h3>
              <p>{opening.company}</p>
              <p>{opening.location}</p>
              <p className="posted-on">
                Posted on: {new Date(opening.posted_on).toLocaleDateString()}
              </p>
              <div className="button-group">
                <a
                  href={opening.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Job
                </a>
                {!company && ( // Only show this button when there's no company filter
                  <a
                    href={`?company=${encodeURIComponent(opening.company)}`}
                    className="company-jobs-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setOccupation("");
                      setLocation("");
                      setCurrentPage(1);
                      setCompany(opening.company);
                    }}
                  >
                    View All Jobs from {opening.company}
                  </a>
                )}
              </div>
            </li>
          ))
        ) : (
          <li>No job openings found.</li>
        )}
      </ul>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || currentPage === 0}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobOpenings;
