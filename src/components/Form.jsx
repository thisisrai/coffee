import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Form = (props) => {
  const { state, dispatch } = useAppState()
  const { token } = state
  const { action } = useParams();
  const [formData, setFormData] = React.useState(state[action])
  const navigate = useNavigate();

  const actions = {
    new: () => {
      return fetch(state.url + "/jobs", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json())
    },
    edit: () => {
      return fetch(state.url + "/jobs/" + state.edit.id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json())
    }
  }

  const handleChange = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    actions[action]().then((data) => {
      props.getJobs()
      navigate("/dashboard")
    })
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label for="title">Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange}/>
        <label for="url">url</label>
        <input type="text" name="application_url" value={formData.application_url} onChange={handleChange}/>
        <label for="company">company</label>
        <input type="text" name="company" value={formData.company} onChange={handleChange}/>
        <input type="submit" value={action} />
      </form>
    </div>
  )
}

export default Form;