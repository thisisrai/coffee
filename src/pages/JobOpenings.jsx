import { useEffect, useState } from "react";
import "../styles/JobOpenings.css";

const JobOpenings = () => {
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");

  const shouldRefetch = () => {
    if (!lastFetchTime) return true;

    const cachedTime = localStorage.getItem("jobOpeningsTimestamp");
    if (!cachedTime) return true;

    const now = new Date();
    const lastFetch = new Date(cachedTime);

    return (
      now.getDate() !== lastFetch.getDate() ||
      now.getMonth() !== lastFetch.getMonth() ||
      now.getFullYear() !== lastFetch.getFullYear()
    );
  };

  const fetchOpenings = async () => {
    try {
      const cachedData = localStorage.getItem("jobOpenings");
      const cachedTime = localStorage.getItem("jobOpeningsTimestamp");

      if (cachedData && cachedTime && !shouldRefetch()) {
        const parsedData = JSON.parse(cachedData);
        setOpenings(parsedData);
        setTotalPages(Math.ceil(parsedData.length / 10));
        setLastFetchTime(cachedTime);
        setLoading(false);
        return;
      }

      localStorage.removeItem("jobOpenings");
      localStorage.removeItem("jobOpeningsTimestamp");

      const url = `https://jobrepo.onrender.com/openings/paginated`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      localStorage.setItem("jobOpenings", JSON.stringify(data));
      localStorage.setItem("jobOpeningsTimestamp", new Date().toISOString());

      setOpenings(data || []);
      setTotalPages(Math.ceil(data.length / 10));
      setLastFetchTime(new Date().toISOString());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  const indexOfLastJob = currentPage * 10;
  const indexOfFirstJob = indexOfLastJob - 10;
  
  const filteredJobs = openings.filter((opening) => {
    const matchesLocation = location
      ? opening.location.toLowerCase().includes(location.toLowerCase())
      : true;
    const matchesOccupation = occupation
      ? opening.title.toLowerCase().includes(occupation.toLowerCase())
      : true;
    return matchesLocation && matchesOccupation;
  });

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

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
      </div>
      <ul>
        {currentJobs.length > 0 ? (
          currentJobs.map((opening) => (
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobOpenings;
