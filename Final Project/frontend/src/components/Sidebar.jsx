// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/chat", label: "Chat" },
    { path: "/projects/1", label: "Projects" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4 hidden md:block">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">Menu</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded-lg ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
