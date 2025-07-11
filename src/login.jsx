import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const from = new URLSearchParams(window.location.search).get("from");
    if (token && from !== "logout" && from !== "register") {
      navigate("/resume");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      const token = data.access_token;
      localStorage.setItem("token", token);
      localStorage.removeItem("resume_analysis");

      setMessage("Login successful! Checking profile...");

      const userInfoRes = await fetch("http://127.0.0.1:8000/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userInfoRes.ok) throw new Error("Failed to fetch user info");
      const userInfo = await userInfoRes.json();

      if (userInfo.role === "admin") {
  navigate("/admin");
} else {
  if (userInfo.profile_status === "YES" && (userInfo.payment === "Paid" || userInfo.payment === "Verifying")) {
    navigate("/profile");
  } else if (userInfo.profile_status === "YES" && userInfo.payment === "Pending") {
    navigate("/pricing");
  } else {
    navigate("/resume");
  }
}

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-[#333]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#ea9f6f]">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#ea9f6f] text-white py-2 rounded-md font-semibold hover:bg-[#e28548] transition duration-200"
          >
            Login
          </button>
        </form>

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
