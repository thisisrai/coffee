import React, { useState } from "react";
import { useAppState } from "../AppState.jsx";
import "../styles/PasswordForms.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const { state } = useAppState();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(state.url + "/password_resets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        setMessage(
          "A password reset email has been sent to your email address."
        );
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setMessage("Error: Unable to send password reset email.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
