import React from "react";
import { useAppState } from "../AppState.jsx";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx";
import JobRow from "../components/JobRow.jsx";
import SortHeader from "../components/SortHeader.jsx";

const Dashboard = () => {
  const { state, dispatch } = useAppState();
  const { token, url, jobs = [] } = state;
  const [editJobId, setEditJobId] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({});
  const [sortConfig, setSortConfig] = React.useState({
    key: "updated_at",
    direction: "descending",
  });

  const getJobs = async () => {
    const response = await fetch(url + "/jobs", {
      method: "get",
      headers: {
        Authorization: "bearer " + token,
      },
    });
    const jobs = await response.json();
    dispatch({ type: "getJobs", payload: jobs });
  };

  React.useEffect(() => {
    getJobs();
  }, []);

  const sortedJobs = React.useMemo(() => {
    let sortableJobs = [...jobs];
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
  }, [jobs, sortConfig]);

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

  return (
    <div className="dashboard">
      <h1>Here's your applied Jobs</h1>
      <Link to="/dashboard/new">
        <button className="add-job-button">Add Job</button>
      </Link>
      <Routes>
        <Route path=":action" element={<Form getJobs={getJobs} />} />
      </Routes>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <SortHeader
                label="Last updated"
                sortKey="updated_at"
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
