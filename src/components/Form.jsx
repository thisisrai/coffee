import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Form = (props) => {
  const { state } = useAppState();
  const { token } = state;
  const { action } = useParams();
  const [formData, setFormData] = React.useState(state[action]);
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
      }).then((response) => response.json());
    },
    edit: () => {
      return fetch(state.url + "/jobs/" + state.edit.id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json());
    },
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    actions[action]().then((data) => {
      props.getJobs();
      navigate("/dashboard");
    });
  };

  const handleCancel = () => {
    navigate("/dashboard"); // Redirects to the dashboard or another page on cancel
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="url">URL</label>
        <input
          type="text"
          name="application_url"
          value={formData.application_url}
          onChange={handleChange}
        />
        <label htmlFor="company">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
        <div className="button-group">
          <input type="submit" value={action} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
