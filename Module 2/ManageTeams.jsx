// src/pages/ManageTeams.jsx
import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  listProjects,
  updateProject,
} from "../services/api";

export default function ManageTeams() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Load projects & team members
  useEffect(() => {
    (async () => {
      try {
        const [userRes, projRes] = await Promise.all([
          getAllUsers(),
          listProjects(),
        ]);

        if (userRes.status === 200) {
          const filtered = userRes.data.filter((u) => u.role === "TEAM_MEMBER");
          setUsers(filtered);
        }

        if (projRes.status === 200) {
          setProjects(projRes.data);
        }
      } catch (err) {
        console.error("Error loading team data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleProjectSelect = (e) => {
    const id = parseInt(e.target.value);
    const project = projects.find((p) => p.id === id);
    setSelectedProject(project);
    setSelectedMembers(project?.teamMembers || []);
  };

  const handleMemberToggle = (email) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== email));
    } else {
      setSelectedMembers([...selectedMembers, email]);
    }
  };

  const handleSave = async () => {
    if (!selectedProject) return;
    setSaving(true);
    try {
      const payload = {
        ...selectedProject,
        teamMembers: selectedMembers,
      };
      const res = await updateProject(selectedProject.id, payload);
      if (res.status === 200) {
        alert("✅ Team updated successfully!");
        // Update project list locally
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id ? { ...p, teamMembers: selectedMembers } : p
          )
        );
      } else {
        alert("❌ Failed to update team. Check backend logs.");
      }
    } catch (err) {
      console.error("Error saving team:", err);
      alert("Error updating team.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading team data...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 Manage Teams</h1>
        <p className="text-gray-600 mb-6">
          Assign or remove team members for each project.
        </p>

        {/* Project selector */}
        <div className="bg-white p-5 rounded-xl shadow mb-8">
          <label className="block font-semibold text-gray-700 mb-2">
            Select Project:
          </label>
          <select
            className="w-full border rounded-lg p-2"
            onChange={handleProjectSelect}
            value={selectedProject?.id || ""}
          >
            <option value="">-- Select a Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Members list */}
        {selectedProject && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProject.name} — Team Members
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {users.map((u) => (
                <label
                  key={u.email}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u.email)}
                    onChange={() => handleMemberToggle(u.email)}
                    className="mr-3 h-5 w-5 text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-5 py-2 rounded-lg text-white ${
                  saving
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {!selectedProject && (
          <p className="text-gray-500 italic mt-6">
            Please select a project to manage its team members.
          </p>
        )}
      </div>
    </div>
  );
}
