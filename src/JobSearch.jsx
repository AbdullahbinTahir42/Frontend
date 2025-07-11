import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useFormData } from "./Formcontext";

function JobSearchDropdown() {
  const [search, setSearch] = useState("");
  const [roleDetected, setRoleDetected] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  const { formData, setFormData } = useFormData();

  // ✅ Prefill from resume analysis
  useEffect(() => {
    const stored = localStorage.getItem("resume_analysis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const detected = parsed?.detectedRole;
        if (detected) {
          setSearch(detected);
          setFormData((prev) => ({ ...prev, job_title: detected }));
          setRoleDetected(true);
        }
      } catch (err) {
        console.error("Error parsing resume_analysis", err);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen pt-28 pb-32 bg-gradient-to-b from-white via-yellow-100 to-yellow-300 text-[#333] mt-14 rounded-[20px] px-4">
      <h2
        className={`text-3xl sm:text-4xl font-bold mb-4 text-center text-[#ea9f6f] transition-all duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        Do you have a job in mind?
      </h2>

      <div
        className={`relative w-full max-w-md mt-4 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <input
          type="text"
          placeholder="Type your job title"
          className="w-full px-4 py-3 rounded-md border border-[#ea9f6f] text-black focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            setFormData({ ...formData, job_title: value });
            setRoleDetected(false);
          }}
        />

        {roleDetected && (
          <p className="text-green-600 text-sm mt-1 font-medium">
            ✅ This was auto-detected from your resume.
          </p>
        )}
      </div>

      <p
        onClick={() => {
          setFormData({ ...formData, job_title: "" });
          navigate("/Category");
        }}
        className={`text-[#ea9f6f] font-bold cursor-pointer hover:underline mt-10 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        I'm not sure
      </p>

      <Footer />
    </div>
  );
}

export default JobSearchDropdown;
