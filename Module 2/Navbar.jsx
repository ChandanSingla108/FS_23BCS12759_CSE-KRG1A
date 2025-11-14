// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("pmapp_user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("pmapp_user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* Left side: App name and quick links */}
      <div className="flex items-center gap-6">
        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Project Management App
        </h1>

        <div className="hidden md:flex gap-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/chat" className="hover:underline">
            Chat
          </Link>
          <Link to="/projects/1" className="hover:underline">
            Projects
          </Link>
        </div>
      </div>

      {/* Right side: User info and Logout */}
      <div className="flex items-center gap-4">
        {user?.name && (
          <span className="text-sm font-medium">
            {user.name} ({user.role})
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
