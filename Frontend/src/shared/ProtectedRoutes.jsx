import React from "react";
import { protectedRouteStyles as s } from "../assets/Styles";
import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoutes({ allowedRole }) {
  const { currentUser, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    console.log("Protected Route: Auth not ready yet");
    return (
      <div className={s.loadingContainer}>
        <div className={s.loadingCard}>Loading your Library Workspace</div>
      </div>
    );
  }
  if (!currentUser) {
    const hasToken = localStorage.getItem("library-auth-token");
    console.log(
      "Protected Route: No Current User, hasToken",
      !!hasToken,
      "allowed Role:",
      allowedRole,
    );
    if (hasToken) {
      return (
        <div className={s.loadingContainer}>
          <div className={s.loadingCard}>Syncing Your Workspace</div>
        </div>
      );
    }
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }
  console.log(
    "Protected Route current user:",
    currentUser,
    "Allowed roles",
    allowedRole,
  );
  if (currentUser.role !== allowedRole) {
    console.warn("Protected route role mismatch");
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }
  
  return <div></div>;
}

export default ProtectedRoutes;
