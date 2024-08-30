import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const Nav = (props) => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  return (
    <header>
      <h1 className="header-title">Coffee Job</h1>

      {/* Sandwich button for auth links */}
      <div className="top-right">
        <button className="sandwich-button" onClick={toggleCardVisibility}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>

        {/* Conditionally show the authentication card with links */}
        {isCardVisible && (
          <div className="auth-container">
            <div className="auth-card">
              <Link to="/" onClick={toggleCardVisibility}>
                <div>Home</div>
              </Link>
              <Link to="/auth/signup" onClick={toggleCardVisibility}>
                <div>Signup</div>
              </Link>
              <Link to="/auth/login" onClick={toggleCardVisibility}>
                <div>Login</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Nav;
