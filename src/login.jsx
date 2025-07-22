import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

 const fetchCurrentUser = async (token) => {
  try {
    console.log("Fetching current user with token:", token);
    if (!token) {
      token = localStorage.getItem("token");
    } 
    const response = await fetch("https://api.hr.growvy.online/me", {
      method: "GET",
      headers: {
        // This is the only method you need
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Throw an error if the server response is not successful (e.g., 401, 500)
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch user");
    }

    const userInfo = await response.json();
    console.log("✅ Successfully fetched user info:", userInfo);
    return userInfo;

  } catch (error) {
    console.error("❌ Error fetching current user:", error);
    // Re-throw the error so the calling function can handle it (e.g., redirect to login)
    throw error;
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      console.log("Starting login process...");
      
      const response = await fetch("https://api.hr.growvy.online/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error response:", errorData);
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      console.log("Login response data:", data);
      
      const token = data.access_token;

      if (!token) {
        throw new Error("No access token received");
      }

      // Clear any existing token first
      localStorage.removeItem("token");
      localStorage.removeItem("resume_analysis");
      
      // Store the new token
      localStorage.setItem("token", token);
      
      // Verify token was stored
      const storedToken = localStorage.getItem("token");
      console.log("Token stored successfully:", storedToken ? "Yes" : "No");
      
      if (!storedToken) {
        throw new Error("Failed to store token in localStorage");
      }

      setMessage("Login successful! Fetching profile...");

      // Add a small delay to ensure token is properly stored
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        const userInfo = await fetchCurrentUser(token);

        console.log("User info received:", userInfo);

        // Navigation logic based on user info
        if (userInfo.role === "admin") {
          console.log("Navigating to admin dashboard");
          navigate("/admin");
        } else {
          if (userInfo.profile_status === "YES" && (userInfo.payment === "Paid" || userInfo.payment === "Verifying")) {
            console.log("Navigating to profile");
            navigate("/profile");
          } else if (userInfo.profile_status === "YES" && userInfo.payment === "Pending") {
            console.log("Navigating to pricing");
            navigate("/pricing");
          } else {
            console.log("Navigating to resume");
            navigate("/resume");
          }
        }

      } catch (userInfoError) {
        console.error("Failed to fetch user info after login:", userInfoError);
        // Even if user info fetch fails, we still have a valid token
        // Navigate to a safe default route
        setMessage("Login successful! Redirecting...");
        navigate("/resume");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      // Clear token on any error
      localStorage.removeItem("token");
      localStorage.removeItem("resume_analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 bg-yellow-100 shadow-xl rounded-xl">
        <h2 className="text-xl font-semibold text-center text-[#ea9f6f] mb-4">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ea9f6f] text-white py-2 rounded-md hover:bg-orange-500 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/how-it-works" className="text-[#ea9f6f] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;