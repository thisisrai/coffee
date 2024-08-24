import React from "react";
import { formatDate } from "../helpers/dateHelper.js";
import "../styles/JobRow.css";

const JobRow = ({
  job,
  editJobId,
  editFormData,
  handleEditClick,
  handleCancelClick,
  handleInputChange,
  handleSaveClick,
  handleDeleteClick,
}) => {
  const statusOptions = ["pending", "Interviewing", "offer", "rejected"];

  // Function to get the class name based on the status
  const getStatusClassName = (status) => {
    if (!status) {
      return "status-custom"; // Handle null or undefined status
    }
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "interviewing":
        return "status-interviewing";
      case "offer":
        return "status-offer";
      case "rejected":
        return "status-rejected";
      default:
        return "status-custom";
    }
  };

  return (
    <tr>
      <td data-label="Last updated">{formatDate(job.updated_at)}</td>
      {editJobId === job.id ? (
        <>
          <td data-label="Status" className="status-cell">
            <select
              name="outcome"
              value={editFormData.outcome}
              onChange={handleInputChange}
              className="status-select"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="">Custom</option>
            </select>
            {editFormData.outcome === "" && (
              <input
                type="text"
                name="outcome"
                value={editFormData.outcome}
                onChange={handleInputChange}
                placeholder="Enter custom status"
                className="status-input"
              />
            )}
          </td>
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
          <td data-label="Status">
            <span className={`status-pill ${getStatusClassName(job.outcome)}`}>
              {job.outcome || "Custom"}
            </span>
          </td>
          <td data-label="Title">
            {job.title.length > 30
              ? job.title.substring(0, 30) + "..."
              : job.title}
          </td>
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
              {job.application_url.substring(0, 20) + "..."}
            </a>
          </td>
          <td data-label="Company">{job.company}</td>
          <td data-label="Actions">
            <button onClick={() => handleEditClick(job)}>Edit</button>
            <button onClick={() => handleDeleteClick(job.id)}>Delete</button>
          </td>
        </>
      )}
    </tr>
  );
};

export default JobRow;
