// src/pages/MyProjects.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listProjects } from "../services/api";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load logged-in user
  useEffect(() => {
    const stored = localStorage.getItem("pmapp_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch projects assigned to user
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const res = await listProjects(user.email);
        if (res.status === 200) setProjects(res.data);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📁 My Projects
        </h1>
        <p className="text-gray-600 mb-6">
          View your assigned projects and open their boards.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-6 text-center text-gray-600">
            You have no assigned projects yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="bg-white shadow-md p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {p.name}
                </h2>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-sm text-gray-500">
                  {p.teamMembers?.length
                    ? `${p.teamMembers.length} member(s)`
                    : "No members assigned"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Overview Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg shadow-xl relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              {selectedProject.name}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedProject.description || "No description available."}
            </p>

            <div className="border-t border-gray-200 pt-4 mb-3">
              <p className="text-sm text-gray-700">
                <strong>Created:</strong>{" "}
                {new Date(selectedProject.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Team Members:</strong>{" "}
                {selectedProject.teamMembers?.length
                  ? selectedProject.teamMembers.join(", ")
                  : "None"}
              </p>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() =>
                  navigate(`/projects/${selectedProject.id}`, {
                    state: { project: selectedProject },
                  })
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Open Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
