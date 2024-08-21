import React from "react";
import { useAppState } from "../AppState.jsx";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx";
import { formatDate } from "../helpers/dateHelper.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const { state, dispatch } = useAppState();
  const { token, url, jobs = [] } = state; // Default jobs to an empty array
  const navigate = useNavigate();
  const [editJobId, setEditJobId] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({});

  // Default sortConfig to "Last updated" in descending order (newest first)
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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FontAwesomeIcon icon={faCaretUp} />
    ) : (
      <FontAwesomeIcon icon={faCaretDown} />
    );
  };

  const handleEditClick = (job) => {
    setEditJobId(job.id);
    setEditFormData({ ...job });
  };

  const handleCancelClick = () => {
    setEditJobId(null);
    setEditFormData({});
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

  const loaded = () => (
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
              <th onClick={() => requestSort("updated_at")}>
                Last updated {getSortIcon("updated_at")}
              </th>
              <th onClick={() => requestSort("title")}>
                Title {getSortIcon("title")}
              </th>
              <th onClick={() => requestSort("application_url")}>
                Application URL {getSortIcon("application_url")}
              </th>
              <th onClick={() => requestSort("company")}>
                Company {getSortIcon("company")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.map((job) => (
              <tr key={job.id}>
                <td data-label="Last updated">{formatDate(job.updated_at)}</td>
                {editJobId === job.id ? (
                  <>
                    <td data-label="Title">
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td data-label="Application URL">
                      <input
                        type="text"
                        name="application_url"
                        value={editFormData.application_url}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td data-label="Company">
                      <input
                        type="text"
                        name="company"
                        value={editFormData.company}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td data-label="Actions">
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={handleCancelClick}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td data-label="Title">{job.title}</td>
                    <td data-label="Application URL">
                      <a
                        href={
                          job.application_url.startsWith("http")
                            ? job.application_url
                            : `http://${job.application_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {job.application_url}
                      </a>
                    </td>
                    <td data-label="Company">{job.company}</td>
                    <td data-label="Actions">
                      <button onClick={() => handleEditClick(job)}>Edit</button>
                      <button
                        onClick={() => {
                          fetch(`${url}/jobs/${job.id}`, {
                            method: "delete",
                            headers: {
                              Authorization: `bearer ${token}`,
                            },
                          }).then(() => {
                            getJobs();
                          });
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return jobs ? loaded() : <h1>Loading...</h1>;
};

export default Dashboard;
