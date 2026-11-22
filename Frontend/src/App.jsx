import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./shared/ProtectedRoutes";
import Adminlayout from "./admin/Adminlayout";
import AdminDashboardPage from "./admin/AdminDashboardPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />} />
      <Route path="/admin" element={<Adminlayout />} />
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <Navigate to="/admin/dashboard" element={<AdminDashboardPage />} />
        }
      />
    </Routes>
  );
}

export default App;
