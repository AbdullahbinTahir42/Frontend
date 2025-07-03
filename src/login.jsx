import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Do not redirect to /resume if user came from logout
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

    // ✅ Fetch user profile_status from /me or /users/me endpoint
    const userInfoRes = await fetch("http://127.0.0.1:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfoRes.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await userInfoRes.json();

    // ✅ Redirect based on profile_status
    if (userInfo.profile_status === "YES") {
      navigate("/profile");
    } else {
      navigate("/resume");
    }

  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      {message && <p className="text-black mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default LoginPage;
