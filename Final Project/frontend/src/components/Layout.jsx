// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react"; // icons

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("pmapp_user") || "null");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Responsive behavior — auto open on large screens
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pmapp_user");
    navigate("/login");
  };

  // 🎯 Role-based sidebar options
  // Replace your managerLinks array with this:

const managerLinks = [
  {
    path: "/manager-dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    path: "/projects",
    label: "Projects",
    icon: <FolderKanban size={18} />,
  },
  {
    path: "/manage-teams",
    label: "Manage Teams",
    icon: <Users size={18} />,
  },
  {
    path: "/chat",
    label: "Team Chat",
    icon: <MessageSquare size={18} />,
  },
];


 const teamLinks = [
  {
    path: "/dashboard",
    label: "My Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    path: "/my-projects",
    label: "My Projects",
    icon: <FolderKanban size={18} />,
  },
  {
    path: "/chat",
    label: "Chat",
    icon: <MessageSquare size={18} />,
  },
];

  const sidebarLinks = user?.role === "PROJECT_MANAGER" ? managerLinks : teamLinks;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out border-r`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b bg-linear-to-r from-blue-600 to-indigo-500 text-white">
          <h2 className="text-lg font-semibold tracking-wide">
            {user?.role === "PROJECT_MANAGER" ? "Manager Panel" : "Team Panel"}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout at bottom */}
        {user && (
          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* ✅ Mobile backdrop overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
        ></div>
      )}

      {/* ✅ Main area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <nav className="bg-white shadow-md flex justify-between items-center px-6 py-3 border-b">
          <div className="flex items-center gap-4">
            {/* Toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 transition"
            >
              <Menu size={24} />
            </button>

            <Link
              to="/"
              className="text-lg font-semibold text-gray-800 hover:text-blue-700 transition"
            >
              Project Management App
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-blue-50 px-3 py-1 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                {user.name} ({user.role})
              </span>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:underline text-blue-700">
                Login
              </Link>
              <Link to="/register" className="hover:underline text-blue-700">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
