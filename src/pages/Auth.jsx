import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Auth = (props) => {
  const { form } = useParams();
  const type = form;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();

  useEffect(() => {
    if (userData && !userData.error) {
      const { token, user } = userData;
      dispatch({ type: "auth", payload: { token, username: user.username } });
      window.localStorage.setItem(
        "auth",
        JSON.stringify({ token, username: user.username })
      );
      navigate("/dashboard");
    }
  }, [userData, dispatch, navigate]);

  const actions = {
    signup: () => {
      return fetch(state.url + "/users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error during signup:", error);
          return { error: "Signup failed. Please try again." };
        });
    },
    login: () => {
      return fetch(state.url + "/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error during login:", error);
          return { error: "Login failed. Please try again." };
        });
    },
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "username" ? value.toLowerCase() : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    actions[type]().then((data) => {
      setUserData(data);
    });
  };

  return (
    <div className="auth auth-form">
      <form onSubmit={handleSubmit}>
        {userData && userData.error && (
          <div className="error-message">{userData.error}</div>
        )}
        <input
          type="email"
          name="username"
          placeholder="Email"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input type="submit" value={type === "login" ? "Log In" : "Sign Up"} />
      </form>
      {type === "login" && (
        <div className="forgot-password">
          Forgot Password?
          <div>
            <Link to="/password/forgot">I don't have a token</Link>
          </div>
          <div>
            <Link to="/password/reset">I have a token</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
