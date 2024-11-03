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

  const fetchOpenings = async () => {
    setLoading(true);
    try {
      const url = new URL("https://jobrepo.onrender.com/openings/paginated");
      url.searchParams.append("page", currentPage);
      if (location) url.searchParams.append("location", location);
      if (occupation) url.searchParams.append("title", occupation);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      const data = result.data || result;
      const totalPages =
        Math.ceil(result.total_count / 50) || Math.ceil(data.length / 50);

      setOpenings(data || []);
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
  }, [currentPage]); // Fetch openings whenever currentPage changes

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    fetchOpenings();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          placeholder="Search by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Search by occupation (e.g., engineer)"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />
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
              <a
                href={opening.job_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Job
              </a>
            </li>
          ))
        ) : (
          <li>No job openings found.</li>
        )}
      </ul>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobOpenings;
