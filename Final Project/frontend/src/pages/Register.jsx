import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api"; // <-- import API function

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER", // default role
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error'|'info', text: '' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);

    if (!validatePassword(formData.password)) {
      setMessage({
        type: "error",
        text:
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(formData);
      console.log("Registration Response:", res?.data || res);

      // Common success shape: 201
      if (res?.status === 201) {
        const text = res.data?.message || "Registration successful. Redirecting to login...";
        setMessage({ type: "success", text });
        // short delay so user sees message then navigate
        setTimeout(() => navigate("/login"), 1400);
      } else if (res?.status === 200 && res.data?.success) {
        // some APIs return 200 with success flag
        setMessage({ type: "success", text: res.data.message || "Registration successful." });
        setTimeout(() => navigate("/login"), 1200);
      } else if (res?.status === 409) {
        // conflict - user already exists -> show message then redirect to login
        setMessage({ type: "error", text: res.data?.message || "User already exists. Redirecting to login..." });
        setTimeout(() => navigate("/login"), 1400);
      } else {
        // fallback
        setMessage({
          type: "error",
          text: res.data?.message || "Unexpected response from server. Please try again.",
        });
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;

      if (status === 409) {
        // user already exists -> show message then redirect to login
        setMessage({ type: "error", text: serverMsg || "User already exists. Redirecting to login..." });
        setTimeout(() => navigate("/login"), 1400);
      } else if (status === 400) {
        setMessage({ type: "error", text: serverMsg || "Invalid data. Please review and try again." });
      } else {
        setMessage({ type: "error", text: serverMsg || "Server error. Please try again later." });
      }
    } finally {
      setLoading(false);
    }
  };

  const messageClass = (type) => {
    if (!type) return "hidden";
    if (type === "success") return "bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded";
    if (type === "error") return "bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded";
    return "bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Register</h2>

        {message && (
          <div className={`mb-4 ${messageClass(message.type)}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-gray-500 text-xs mt-1">
              Must contain at least 8 characters, including uppercase, lowercase, number, and special character.
            </p>
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="TEAM_MEMBER">Team Member</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white rounded-lg py-2 transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? {" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
