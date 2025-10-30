// src/routes/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  // If no token or no user → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ If authorized → render the nested route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
