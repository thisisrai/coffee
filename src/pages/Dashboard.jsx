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
      <ul>
        {jobs.map(job => {
          return (
            <div className="job" key={job.id}>
            <h2>{job.title}</h2>
            <h4>{job.application_url}</h4>
            <h4>{job.company}</h4>
            <button onClick={() => {
              dispatch({type: "select", payload: job})
              navigate("/dashboard/edit")
            }}>Edit</button>
            <button onClick={() => {
              fetch(url + "/jobs/" + job.id, {
                method: "delete",
                headers: {
                  Authorization: "bearer " + token
                }
              }).then(() => {getJobs()})
              
            }}>Delete</button>
          </div>
          )
        })}
      </ul>
    </div>
  )

  return (jobs) ? loaded() : <h1>Loading...</h1>;
}

export default Dashboard;