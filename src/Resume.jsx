import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function ResumeUpload() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage(`Selected: ${file.name}`);
    }
  };

  // MODIFIED SECTION: The complex `analyzeResumeWithAuth` function has been removed
  // and its logic corrected inside `handleSubmit`.

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a resume file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Create FormData and append the file.
      // The key "resume" MUST match the argument name in your Python function.
      const formData = new FormData();
      formData.append("resume", selectedFile);

      // Define headers WITHOUT 'Content-Type'.
      // The browser will automatically set 'Content-Type: multipart/form-data' for you.
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Make the fetch request
      const response = await fetch("https://api.hr.growvy.online/resume/analyze", {
        method: "POST",
        headers: headers,
        body: formData,
      });

      // Handle the response
      if (!response.ok) {
        // Try to get a detailed error message from the JSON response
        const errorData = await response.json().catch(() => ({})); // Use .catch() for non-JSON error responses
        const detail = errorData.detail || `Request failed with status ${response.status}`;
        throw new Error(detail);
      }

      const data = await response.json();
      localStorage.setItem("resume_analysis", JSON.stringify(data.analysis));
      setMessage("Resume analyzed successfully! Redirecting...");
      setTimeout(() => navigate("/remote-jobs"), 1500);

    } catch (error) {
      console.error("Resume submission error:", error);
      setMessage(error.message);

      // If authentication fails (401), redirect to login
      if (error.message.includes("401") || error.message.includes("Not authenticated")) {
        setMessage("Session expired. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTooltipClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 5000);
  };

  // UNCHANGED SECTION: The entire returned JSX is identical to your original code.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200 px-4 pt-16">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center text-[#ea9f6f]">
        Want better job matches? Upload your resume.
      </h1>

      <div className="relative mb-6 flex justify-center">
        {showTooltip && (
          <div className="absolute bottom-6 w-72 bg-yellow-100 border border-yellow-300 rounded shadow-lg px-4 py-2 text-sm text-yellow-900 z-10">
            Uploading your resume helps us match you faster. You can still
            update answers later.
            <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-yellow-100 rotate-45 border-b border-r border-yellow-300" />
          </div>
        )}
        <button
          onClick={handleTooltipClick}
          className="text-[#ea9f6f] hover:text-orange-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </button>
      </div>

      <div
        onClick={handleUploadClick}
        className="cursor-pointer bg-white border border-yellow-300 rounded-md p-8 flex flex-col items-center justify-center mb-4 hover:scale-105 transition shadow-lg"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        <div className="mb-4">
          <div className="w-16 h-16 bg-[#ea9f6f] rounded-full flex items-center justify-center transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4"
              />
            </svg>
          </div>
        </div>
        <p className="text-lg font-medium text-[#ea9f6f] mb-1">
          Upload a Resume
        </p>
        <p className="text-sm text-gray-600 text-center">
          We'll fill in your answers automatically.
        </p>
        <span className="mt-3 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-orange-300 to-orange-500 text-white font-medium transition hover:brightness-110">
          Resume Review Included
        </span>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[#ea9f6f] text-white px-6 py-2 rounded hover:bg-orange-500 transition mb-4"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Submit Resume"}
      </button>

      {message && <p className="text-[#ea9f6f] mt-2">{message}</p>}

      <p
        onClick={() => navigate("/remote-jobs")}
        className="text-[#ea9f6f] font-bold cursor-pointer hover:underline"
      >
        Skip for Now
      </p>

      <Footer />
    </div>
  );
}