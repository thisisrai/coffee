import React from "react";
import { useAppState } from "../AppState.jsx";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx";
import { formatDate } from "../helpers/dateHelper.js";

const Dashboard = (props) => {
  const { state, dispatch } = useAppState();
  const { token, url, jobs } = state;
  const navigate = useNavigate();
  const [editJobId, setEditJobId] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({});

  const getJobs = async () => {
    const response = await fetch(url + "/jobs", {
      method: "get",
      headers: {
        Authorization: "bearer " + token
      }
    });
    const jobs = await response.json();
    dispatch({ type: "getJobs", payload: jobs });
  };

  React.useEffect(() => {
    getJobs();
  }, []);

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
    await fetch(`${url}/jobs/${editJobId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      },
      body: JSON.stringify(editFormData)
    });
    setEditJobId(null);
    setEditFormData({});
    getJobs();
  };

  const loaded = () => (
    <div className="dashboard">
      <h1>Here's your applied Jobs</h1>
      <Link to="/dashboard/new">
        <button>Add Job</button>
      </Link>
      <Routes>
        <Route path=":action" element={<Form getJobs={getJobs} />} />
      </Routes>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Last updated</th>
              <th>Title</th>
              <th>Application URL</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
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
                              Authorization: `bearer ${token}`
                            }
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