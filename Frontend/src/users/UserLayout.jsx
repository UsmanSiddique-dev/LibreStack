import React from "react";
import { userLayoutStyles as s } from "../assets/Styles";
import logoSrc from "../assets/library-mark.svg";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../shared/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
const navItems = [
  {
    label: "Student Dashboard",
    description: "Your college library overview",
    href: "/user/dashboard",
    match: "/user/dashboard",
    icon: "dashboard",
  },
  {
    label: "Books Page",
    description: "Issued books, fines, and due dates",
    href: "/user/books",
    match: "/user/books",
    icon: "books",
  },
  {
    label: "Edit Profile",
    description: "Update your student information",
    href: "/user/profile",
    match: "/user/profile",
    icon: "users",
  },
];

function UserLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const footerItems = currentUser
    ? [
        {
          label: "Logout",
          icon: "login",
          kind: "primary",
          action: () => {
            logout();
            navigate("/login");
          },
        },
      ]
    : [];
  return (
    <div className={s.layoutContainer}>
      <Sidebar
        title="Student Desk"
        subtitle="College Library Access"
        badge="Student Section"
        navItems={navItems}
        footerItems={footerItems}
        logoSrc={logoSrc}
      />
      <main className={s.mainContent}>
        <div className={s.innerContainer}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default UserLayout;
