import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "../pages/Auth.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import AdminDashboard from "../admin-dashboard/AdminDashboard.jsx";
import ForgotPassword from "../components/ForgotPassword.jsx";
import ResetPassword from "../components/ResetPassword.jsx";
import NotFound from "../pages/NotFound.jsx"; // Import the NotFound component
import { useAppState } from "../AppState.jsx";
import Nav from "./Nav.jsx";
import InspirationStories from "../pages/InspirationStories.jsx";
import JobOpenings from "../pages/JobOpenings.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Integration from "../pages/Integration.jsx";

export const App = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(window.localStorage.getItem("auth"));
    if (auth) {
      dispatch({ type: "auth", payload: auth });
    }
  }, []);

  return (
    <>
      <Nav />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<JobOpenings />} />
        <Route path="/inspiration" element={<InspirationStories />} />
        <Route path="/job-listings" element={<JobOpenings />} />
        <Route path="/auth/:form" element={<Auth />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/integration" element={<Integration />} />
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />{" "}
        {/* Catch-all route for 404 */}
      </Routes>
    </>
  );
};
