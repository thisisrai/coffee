import React from "react";
import { formatDate } from "../helpers/dateHelper.js";

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
  return (
    <tr>
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
