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

  return (
    <tr>
      <td data-label="Applied on">{formatDate(job.created_at)}</td>
      {editJobId === job.id ? (
        <>
          <td data-label="Status" className="status-cell">
            <select
              name="outcome"
              value={editFormData.outcome || "custom"}
              onChange={handleInputChange}
              className="status-select"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {editFormData.outcome &&
              !statusOptions.includes(editFormData.outcome.toLowerCase()) && (
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
            <span
              className={`status-pill status-${
                job.outcome ? job.outcome.toLowerCase() : "custom"
              }`}
            >
              {job.outcome || "No status"}
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
