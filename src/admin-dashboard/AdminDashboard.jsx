import { useState, useEffect, useMemo } from "react";
import { useAppState } from "../AppState.jsx";
import { useNavigate } from "react-router-dom";
import "../admin-dashboard/AdminDashboard.css";

const AdminDashboard = () => {
  const { state } = useAppState();
  const { token, url } = state;
  const [stats, setStats] = useState({
    totalJobs: 0,
    recentApplications: []
  });
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({ name: '', working: false, job_board: '', last_ran: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStats();
    fetchCompanies();
  }, [url, token]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${url}/jobs`, {
        headers: {
          Authorization: "bearer " + token
        }
      });

      if (response.ok) {
        const jobs = await response.json();
        setStats({
          totalJobs: jobs.length,
          recentApplications: jobs.slice(0, 10).map(job => ({
            ...job,
            username: state.username
          }))
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${url}/companies`, {
        headers: {
          Authorization: "bearer " + token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "bearer " + token
        },
        body: JSON.stringify({ company: newCompany })
      });

      if (response.ok) {
        setNewCompany({ name: '', working: false, job_board: '', last_ran: null });
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.job_board?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  // Add edit handlers
  const handleEditClick = (company) => {
    setEditCompanyId(company.id);
    setEditFormData({ ...company });
  };

  const handleCancelClick = () => {
    setEditCompanyId(null);
    setEditFormData({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${url}/companies/${editCompanyId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
        },
        body: JSON.stringify({ company: editFormData }),
      });
      if (response.ok) {
        setEditCompanyId(null);
        setEditFormData({});
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        const response = await fetch(`${url}/companies/${id}`, {
          method: "delete",
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if (response.ok) {
          fetchCompanies();
        }
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <div className="stat-value">{stats.totalJobs}</div>
        </div>
        <div className="stat-card">
          <h3>Companies</h3>
          <div className="stat-value">{companies.length}</div>
        </div>
      </div>

      <div className="companies-section">
        <h2>Companies</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <form onSubmit={handleCreateCompany} className="company-form">
          <input
            type="text"
            placeholder="Company Name"
            value={newCompany.name}
            onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
            className="search-bar"
          />
          <input
            type="text"
            placeholder="Job Board URL"
            value={newCompany.job_board}
            onChange={(e) => setNewCompany({...newCompany, job_board: e.target.value})}
            className="search-bar"
          />
          <button type="submit" className="add-job-button">Add Company</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Job Board</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id}>
                {editCompanyId === company.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="job_board"
                        value={editFormData.job_board || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        name="working"
                        value={editFormData.working || false}
                        onChange={handleInputChange}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </td>
                    <td>{new Date(company.last_ran || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <button onClick={handleSaveClick} className="action-button save">Save</button>
                      <button onClick={handleCancelClick} className="action-button cancel">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{company.name}</td>
                    <td>{company.job_board}</td>
                    <td>
                      <span className={`status-badge ${company.working ? 'interviewing' : 'pending'}`}>
                        {company.working ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(company.last_ran || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEditClick(company)} className="action-button edit">Edit</button>
                      <button onClick={() => handleDeleteClick(company.id)} className="action-button delete">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="recent-applications">
        <h2>Recent Applications</h2>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentApplications.map((app, index) => (
              <tr key={index}>
                <td>{app.company}</td>
                <td>{app.title}</td>
                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${app.outcome?.toLowerCase()}`}>
                    {app.outcome || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
