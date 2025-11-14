// src/pages/ProjectList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects } from "../services/api";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listProjects(); // all projects (manager view)
        if (res.status === 200) setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📂 All Projects</h1>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-6 text-gray-600 text-center">
            No projects found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                state={{ project: p }}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {p.name}
                </h2>
                <p className="text-gray-600 mb-3">{p.description}</p>
                <p className="text-sm text-gray-500">
                  Team Members:{" "}
                  {p.teamMembers?.length ? p.teamMembers.join(", ") : "None"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
