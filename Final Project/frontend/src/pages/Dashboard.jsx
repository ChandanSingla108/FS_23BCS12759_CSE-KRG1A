// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects } from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load current user
  useEffect(() => {
    const storedUser = localStorage.getItem("pmapp_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch projects assigned to the logged-in user
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const res = await listProjects(user.email);
        if (res.status === 200 && Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          console.warn("Unexpected project response:", res);
        }
      } catch (err) {
        console.error("Error loading assigned projects:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          👨‍💻 Team Member Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome {user?.name}! Here are the projects assigned to you.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-gray-500 bg-white shadow rounded-xl p-6 text-center">
            No projects assigned yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                state={{ project: p }}
                className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {p.name}
                </h2>
                <p className="text-gray-600 mb-3">{p.description}</p>
                <p className="text-sm text-gray-500">
                  Assigned Team:{" "}
                  {p.teamMembers && p.teamMembers.length > 0
                    ? p.teamMembers.join(", ")
                    : "N/A"}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Created: {new Date(p.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
