import React, { useState } from "react";
import "../styles/CompanyIntegrationRequest.css";
import loadingGif from "../public/loading.gif";

const CompanyIntegrationRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://jobrepo.onrender.com/integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }), // Send email and message
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Your request has been submitted successfully!");
      } else {
        setStatus("There was an error submitting your request.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setStatus("Error occurred while submitting your request.");
    } finally {
      setEmail("");
      setMessage("");
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  return (
    <div className="integration-request">
      <h3>Oh no! We couldn't find your company.</h3>
      <p>Would you like to connect to integrate your company?</p>
      <form onSubmit={handleSubmit} className="integration-form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        {!loading && (
          <button type="submit" disabled={loading}>
            Submit
          </button>
        )}
      </form>
      <br />
      {loading && <img src={loadingGif} alt="Loading..." />}
      {status && <p>{status}</p>} {/* Display status message */}
    </div>
  );
};

export default CompanyIntegrationRequest;
