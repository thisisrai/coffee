import React from "react";
import { useAppState } from "../AppState.jsx";
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import Form from "../components/Form.jsx"

const Dashboard = (props) => {
  const {state, dispatch} = useAppState()
  // const { form } = useParams();
  const {token, url, jobs} = state
  const navigate = useNavigate()

  const getJobs = async () => {
    const response = await fetch(url + "/jobs", {
      method: "get",
      headers: {
        Authorization: "bearer " + token
      }
    })
    const jobs = await response.json()
    dispatch({type: "getJobs", payload: jobs})
  }

  React.useEffect(() => {getJobs()}, [])

  const loaded = () => (
    <div className="dashboard">
      <h1>Here's your applied Jobs</h1>
      <Link to="/dashboard/new">
        <button>Add Job</button>
      </Link>
      <Routes>
        <Route path=':action' element={<Form getJobs={getJobs} />} />
      </Routes>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Application URL</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td><a href={job.application_url.startsWith('http') ? job.application_url : `http://${job.application_url}`} target="_blank" >{job.application_url}</a></td>
                <td>{job.company}</td>
                <td>
                  <button onClick={() => {
                    dispatch({ type: "select", payload: job });
                    navigate("/dashboard/edit");
                  }}>Edit</button>
                  <button onClick={() => {
                    fetch(`${url}/jobs/${job.id}`, {
                      method: "delete",
                      headers: {
                        Authorization: `bearer ${token}`
                      }
                    }).then(() => {
                      getJobs();
                    });
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (jobs) ? loaded() : <h1>Loading...</h1>;
}

export default Dashboard;