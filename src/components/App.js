import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Auth from "../pages/Auth.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ForgotPassword from "../components/ForgotPassword.jsx"; // Import ForgotPassword component
import ResetPassword from "../components/ResetPassword.jsx"; // Import ResetPassword component
import { useAppState } from "../AppState.jsx";
import Nav from "./Nav.jsx";
import InspirationStories from "../pages/InspirationStories.jsx";
import JobOpenings from "../pages/JobOpenings.jsx";

export const App = (props) => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(window.localStorage.getItem("auth"));

    if (auth) {
      dispatch({ type: "auth", payload: auth });
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  }, []);

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inspiration" element={<InspirationStories />} />
        <Route path="/job-listings" element={<JobOpenings />} />
        <Route path="/auth/:form" element={<Auth />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />{" "}
        {/* Forgot Password route */}
        <Route path="/password/reset" element={<ResetPassword />} />{" "}
        {/* Reset Password route */}
      </Routes>
    </>
  );
};
