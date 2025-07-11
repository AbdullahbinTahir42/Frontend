import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterForm({ onSuccess, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      localStorage.removeItem("token");

      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const loginResponse = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Registration succeeded but auto-login failed.");
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("token", loginData.access_token);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-20 pt-16 w-full relative">
      <div className="relative w-full max-w-sm p-6 bg-yellow-100 shadow-xl rounded-xl">
        {/* ❌ Close Button Inside the Card */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-center text-[#ea9f6f] mb-4">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
            required
          />
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
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
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
            className="w-full bg-[#ea9f6f] text-white py-2 rounded-md hover:bg-orange-500 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-[#ea9f6f] hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
