import React, { useState } from "react";
import "../styles/Integration.css"; // Import the Integration CSS
import loadingGif from "../public/loading.gif"; // Import the loading GIF
import CompanyIntegrationRequest from "./CompanyIntegrationRequest"; // Import the new component

const Integration = () => {
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState(""); // State to hold the status message
  const [companyData, setCompanyData] = useState(null); // State to hold company data
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Company Name:", companyName);
    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await fetch(
        `https://jobrepo.onrender.com/integration?company=${encodeURIComponent(
          companyName
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus(data.status); // Set status to 'found'
        setCompanyData(data.company); // Set company data if found
      } else {
        setStatus(data.status); // Set status to 'not found'
        setCompanyData(null); // Clear company data if not found
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setStatus("Error occurred while fetching data.");
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  // Determine the class for the status message
  const statusClass = status === "not found" ? "error" : "success";

  return (
    <div className="integration">
      {status !== "not found" && ( // Only show this section if status is not "not found"
        <>
          <h2>Check Company Integration</h2>
          <br />
          <p>
            Enter your company name below to see if it is integrated with our
            Job Board.
          </p>
          <br />
          <form onSubmit={handleSubmit}>
            <label>
              Company Name:
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </label>
            <button type="submit">Check</button>
          </form>
          {loading ? ( // Show loading GIF if loading is true
            <img src={loadingGif} alt="Loading..." />
          ) : (
            status && (
              <p className={`status-message ${statusClass}`}>
                Status: {status}
              </p>
            )
          )}
        </>
      )}
      {companyData ? (
        <div className="company-details">
          <h3>Congratulations, your company is already in our Job Board!</h3>
          <div className="giphy-container">
            <iframe
              src="https://giphy.com/embed/9w9Bpoiddg72U"
              width="480"
              height="269"
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
              title="Excited Giphy"
            ></iframe>
          </div>
        </div>
      ) : (
        status === "not found" && <CompanyIntegrationRequest /> // Show the new component if company is not found
      )}
    </div>
  );
};

export default Integration;
