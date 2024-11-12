import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "../AppState.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "../styles/SideBarButton.css";

const Nav = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCardVisible, setIsCardVisible] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  const handleLogout = () => {
    setIsCardVisible(false); // Close sidebar
    dispatch({ type: "logout" });
    navigate("/auth/login");
  };

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCardVisible &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsCardVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCardVisible]);

  // Handle navigation protection
  useEffect(() => {
    const protectedRoutes = ["/dashboard"];
    if (!state.token && protectedRoutes.includes(location.pathname)) {
      navigate("/auth/login");
    }
  }, [state.token, navigate, location.pathname]);

  // Handle navigation link clicks
  const handleNavClick = () => {
    setIsCardVisible(false);
  };

  return (
    <header>
      <h1>Coffee Job</h1>
      <button
        className="toggle-card-button"
        onClick={toggleCardVisibility}
        ref={buttonRef}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {isCardVisible && (
        <div className="sidebar-card" ref={sidebarRef}>
          <button className="close-card-button" onClick={toggleCardVisibility}>
            &times;
          </button>
          <nav className="nav-container">
            {!state.token && (
              <>
                {/* <Link to="/" onClick={handleNavClick}>
                  <div>Home</div>
                </Link> */}
                <Link to="/job-listings" onClick={handleNavClick}>
                  <div>Jobs</div>
                </Link>
                <Link to="/inspiration" onClick={handleNavClick}>
                  <div>Inspiration</div>
                </Link>
                <Link to="/auth/signup" onClick={handleNavClick}>
                  <div>Signup</div>
                </Link>
              </>
            )}
            {state.token ? (
              <>
                <Link to="/job-listings" onClick={handleNavClick}>
                  <div>Jobs</div>
                </Link>
                <Link to="/dashboard" onClick={handleNavClick}>
                  <div>Dashboard</div>
                </Link>
                <Link to="/inspiration" onClick={handleNavClick}>
                  <div>Inspiration</div>
                </Link>
                <div onClick={handleLogout}>Logout</div>
              </>
            ) : (
              <Link to="/auth/login" onClick={handleNavClick}>
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
