import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // If already logged in → Redirect to dashboard
  useEffect(() => {
    const user = localStorage.getItem("pmapp_user");
    if (user) {
  try {
    const parsed = JSON.parse(user);
    if (parsed?.email) {
      navigate("/dashboard");
    }
  } catch {
    localStorage.removeItem("pmapp_user");
  }
}

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (res.status === 200 && res.data?.success) {
        const user = res.data.user;

        // ✅ Store user in localStorage
        localStorage.setItem("pmapp_user", JSON.stringify(user));

        setMessage({ type: "success", text: "Login successful! Redirecting..." });

        setTimeout(() => {
          if (user.role === "PROJECT_MANAGER") {
  navigate("/manager-dashboard");
} else {
  navigate("/dashboard");
}

        }, 800);

      } else if (res.status === 404) {
        setMessage({ type: "error", text: "User does not exist. Redirecting to Register..." });
        setTimeout(() => navigate("/register"), 1000);

      } else if (res.status === 401) {
        setMessage({ type: "error", text: "Invalid email or password." });

      } else {
        setMessage({ type: "error", text: "Unexpected server response." });
      }

    } catch (err) {
      console.error("Login error:", err);
      setMessage({ type: "error", text: "Server error. Try again later." });

    } finally {
      setLoading(false);
    }
  };

  const messageClass = (type) =>
    type === "success"
      ? "bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded mb-4"
      : "bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded mb-4";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        {message && <div className={messageClass(message.type)}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white rounded-lg py-2 transition ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
