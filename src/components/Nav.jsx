import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

import '../styles/SideBarButton.css';

const Nav = (props) => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  const handleLogout = () => {
    dispatch({ type: "logout" });
    navigate("/auth/login");
  };

  useEffect(() => {
    if (!state.token) {
      navigate("/auth/login");
    }
  }, [state.token, navigate]);

  return (
    <header>
      <h1>Coffee Job</h1>
      <button className="toggle-card-button" onClick={toggleCardVisibility}>
        Options
      </button>
      {isCardVisible && (
        <div className="sidebar-card">
          <button className="close-card-button" onClick={toggleCardVisibility}>
            &times;
          </button>
          <nav className="nav-container">
            <Link to="/">
              <div>Home</div>
            </Link>
            <Link to="/auth/signup">
              <div>Signup</div>
            </Link>
            {state.token ? (
              <div onClick={handleLogout}>
                Logout
              </div>
            ) : (
              <Link to="/auth/login">
                <div>Login</div>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Nav;
