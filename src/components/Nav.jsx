import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "../AppState.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import '../styles/SideBarButton.css';

const Nav = (props) => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCardVisible, setIsCardVisible] = useState(false);

  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  const handleLogout = () => {
    dispatch({ type: "logout" });
    navigate("/auth/login");
  };

  useEffect(() => {
    // Redirect to login only if trying to access a protected route
    const protectedRoutes = ["/dashboard"];
    if (!state.token && protectedRoutes.includes(location.pathname)) {
      navigate("/auth/login");
    }
  }, [state.token, navigate, location.pathname]);

  return (
    <header>
      <h1>Coffee Job</h1>
      <button className="toggle-card-button" onClick={toggleCardVisibility}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      {isCardVisible && (
        <div className="sidebar-card">
          <button className="close-card-button" onClick={toggleCardVisibility}>
            &times;
          </button>
          <nav className="nav-container">
            {!state.token && (
              <>
                <Link to="/">
                  <div>Home</div>
                </Link>
                <Link to="/auth/signup">
                  <div>Signup</div>
                </Link>
              </>
            )}
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
