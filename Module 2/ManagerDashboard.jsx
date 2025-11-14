// src/pages/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, createProject, listProjects } from "../services/api";

export default function ManagerDashboard() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    teamMembers: [],
  });

  // ✅ Load projects from backend instead of localStorage
  useEffect(() => {
    (async () => {
      try {
        const res = await listProjects();
        if (res.status === 200) {
          setProjects(res.data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    })();
  }, []);

  // Load team members from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllUsers();
        if (res.status === 200) {
          const members = res.data.filter((u) => u.role === "TEAM_MEMBER");
          setUsers(members);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleMemberSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setNewProject({ ...newProject, teamMembers: selected });
  };

  // ✅ Send project to backend
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newProject.name.trim()) return;

  const payload = {
    name: newProject.name.trim(),
    description: newProject.description.trim(),
    teamMembers: newProject.teamMembers, // ✅ must be array
  };

  const res = await createProject(payload);
  if (res.status === 201) {
    setProjects([res.data, ...projects]); // ✅ add returned project
    setNewProject({ name: "", description: "", teamMembers: [] });
  }
};

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">📁 Project Management (Manager)</h1>

        {/* Create project card */}
        <div className="bg-white shadow rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">➕ Create New Project</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={newProject.name}
              onChange={handleChange}
              placeholder="Project name"
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="description"
              value={newProject.description}
              onChange={handleChange}
              placeholder="Short description"
              className="w-full border rounded-lg p-3"
            />

            <div>
              <label className="block mb-2 font-medium">Assign team members</label>
              <select
                multiple
                value={newProject.teamMembers}
                onChange={handleMemberSelect}
                className="w-full border rounded-lg p-2 h-36"
              >
                {users.map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name} — {u.email}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create Project
            </button>
          </form>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.length === 0 ? (
            <div className="text-gray-600">No projects yet — create your first project.</div>
          ) : (
            projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="block bg-white shadow-md p-5 rounded-2xl hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 text-gray-600">{p.description}</p>
                <p className="mt-3 text-sm text-gray-700">
                  <strong>Team:</strong> {p.teamMembers?.length ? p.teamMembers.join(", ") : "No members"}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
