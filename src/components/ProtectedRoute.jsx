import { Navigate } from "react-router-dom";
import { useAppState } from "../AppState.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { state } = useAppState();
  const { token, username } = state;

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (adminOnly) {
    const allowedUsers = [
      "thisisrailee@gmail.com",
      "rai@coffeejob.io",
      "kavin@coffeejob.io",
      "tjhan.kavin@gmail.com",
    ];
    return allowedUsers.includes(username) ? children : <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
