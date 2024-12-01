import { useState, useMemo, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAppState } from "../AppState.jsx";
import Form from "../components/Form.jsx";
import JobRow from "../components/JobRow.jsx";
import SortHeader from "../components/SortHeader.jsx";
import PieChart from "../components/PieChart.jsx"; // Import your PieChart component
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { state, dispatch } = useAppState();
  const { token, url, jobs = [] } = state;
  const [editJobId, setEditJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "descending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  const getJobs = async () => {
    const response = await fetch(`${url}/jobs`, {
      method: "get",
      headers: {
        Authorization: "bearer " + token,
      },
    });
    const jobs = await response.json();
    dispatch({ type: "getJobs", payload: jobs });
  };

  useEffect(() => {
    const auth = JSON.parse(window.localStorage.getItem("auth"));

    if (auth) {
      dispatch({ type: "auth", payload: auth });
      setIsAuthReady(true);
    } else {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    if (isAuthReady) {
      getJobs();
    }
  }, [isAuthReady]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const sortedJobs = useMemo(() => {
    let sortableJobs = [...filteredJobs];
    if (sortConfig.key !== null) {
      sortableJobs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableJobs;
  }, [filteredJobs, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key !== key) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = (job) => {
    setEditJobId(job.id);
    setEditFormData({ ...job });
  };

  const handleCancelClick = () => {
    setEditJobId(null);
    setEditFormData({});
  };

  const handleDeleteClick = async (id) => {
    try {
      await fetch(`${url}/jobs/${id}`, {
        method: "delete",
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      getJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      await fetch(`${url}/jobs/${editJobId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
        },
        body: JSON.stringify(editFormData),
      });
      setEditJobId(null);
      setEditFormData({});
      getJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  // Dynamically calculate job status counts
  const jobStatusCounts = useMemo(() => {
    const counts = {};
    jobs.forEach((job) => {
      const status = job.outcome || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  return (
    <div className="dashboard">
      <h1>Here's your applied Jobs</h1>
      <div className="information-container">
        {jobs.length > 0 ? (
          <div className="pie-chart-container">
            <PieChart data={jobStatusCounts} />
          </div>
        ) : null}
        <div className="section-2">
          <Link to="/dashboard/new">
            <button className="add-job-button">Add Job</button>
          </Link>
          <Routes>
            <Route path=":action" element={<Form getJobs={getJobs} />} />
          </Routes>
          <div>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by job title or company name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <SortHeader
                label="Applied on"
                sortKey="created_at"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <SortHeader
                label="Status"
                sortKey="outcome"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <SortHeader
                label="Title"
                sortKey="title"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <SortHeader
                label="Application URL"
                sortKey="application_url"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <SortHeader
                label="Company"
                sortKey="company"
                sortConfig={sortConfig}
                requestSort={requestSort}
              />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                editJobId={editJobId}
                editFormData={editFormData}
                handleEditClick={handleEditClick}
                handleCancelClick={handleCancelClick}
                handleInputChange={handleInputChange}
                handleSaveClick={handleSaveClick}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
