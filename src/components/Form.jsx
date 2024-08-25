import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Form = (props) => {
  const { state } = useAppState();
  const { token } = state;
  const { action } = useParams();

  // Initialize formData with a default status of "pending"
  const [formData, setFormData] = React.useState({
    ...state[action],
    outcome: state[action]?.outcome || "pending",
  });

  const [isCustomStatus, setIsCustomStatus] = React.useState(
    formData.outcome === ""
  );

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

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setIsCustomStatus(true);
      setFormData({ ...formData, outcome: "" });
    } else {
      setIsCustomStatus(false);
      setFormData({ ...formData, outcome: value });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    actions[action]().then((data) => {
      props.getJobs();
      navigate("/dashboard");
    });
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <label htmlFor="url">URL</label>
        <input
          type="text"
          name="application_url"
          value={formData.application_url}
          onChange={handleInputChange}
        />
        <label htmlFor="company">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
        />

        {/* Status Field with Default "Pending" */}
        <label htmlFor="outcome">Status</label>
        <select
          name="outcome"
          value={isCustomStatus ? "" : formData.outcome}
          onChange={handleSelectChange}
          className="styled-select"
        >
          <option value="pending">Pending</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="">Custom</option>
        </select>

        {isCustomStatus && (
          <input
            type="text"
            name="outcome"
            value={formData.outcome}
            onChange={handleInputChange}
            placeholder="Or write your own status"
            className="custom-input"
          />
        )}

        <div className="button-group">
          <button type="button" onClick={handleCancel}>
            cancel
          </button>
          <input type="submit" value={action} />
        </div>
      </form>
    </div>
  );
};

export default Form;
