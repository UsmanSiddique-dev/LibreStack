import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./shared/ProtectedRoutes";
import Adminlayout from "./admin/AdminLayout";
import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminBookPage from "./admin/AdminBookPage";
import AdminUsersPage from "./admin/AdminUsersPage";
import AdminFinesPage from "./admin/AdminFinesPage";
import UserLayout from "./users/UserLayout";
import UserDashboardPage from "./users/UserDashboard";
import UserBooksPage from "./users/UserBooksPage";
import UserEditProfilePage from "./users/UserEditProfilePage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<Adminlayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="books" element={<AdminBookPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="fines" element={<AdminFinesPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="books" element={<UserBooksPage />} />
          <Route path="profile" element={<UserEditProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
