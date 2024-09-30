import { useState } from "react";
import { useAppState } from "../AppState.jsx";
import "../styles/PasswordForms.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const { state } = useAppState();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(state.url + `/password_resets/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      if (response.ok) {
        setMessage("Your password has been reset successfully. Please log in.");
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setMessage("Error: Unable to reset password.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
