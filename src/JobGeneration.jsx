import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "./Formcontext";

export default function JobGenerationPage() {
  const [step, setStep] = useState(0);
  const [showCircle, setShowCircle] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { formData } = useFormData();

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setShowCircle(false), 5000));
    timers.push(setTimeout(() => setStep(1), 1500));
    timers.push(setTimeout(() => setStep(2), 3000));
    timers.push(setTimeout(() => setStep(3), 4500));
    timers.push(setTimeout(() => setShowResults(true), 5500));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (showResults) {
      const submitData = async () => {
        const token = localStorage.getItem("token");
        const transformedData = {
          job_title: formData.job_title,
          salary_expectation: formData.salary_expectation || null,
          skills: formData.skills ?? [],
          remote_type: formData.remote_type || null,
          location: formData.location?.place || "",
          benefits: formData.benefits ?? [],
          career_level: formData.career_level || null,
          work_type: formData.work_type || null,
        };

        try {
          const response = await fetch("http://127.0.0.1:8000/profiles/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(transformedData),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(JSON.stringify(err));
          }

          await response.json();
          navigate("/profile");
        } catch (error) {
          console.error("❌ Error submitting form data:", error.message);
        }
      };

      submitData();
    }
  }, [showResults, formData, navigate]);

  if (!showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200 px-4 text-[#333] rounded-[20px]">
        {showCircle && (
          <div
            className="w-20 h-20 border-8 border-[#ea9f6f] border-t-transparent rounded-full animate-spin mb-6"
            style={{ animationDuration: "2s" }}
          />
        )}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#ea9f6f]">
          Generating your profile...
        </h2>
        <div className="flex flex-col items-start space-y-4 text-gray-800 font-medium text-base">
          {step >= 1 && (
            <div className="flex items-center space-x-3">
              <span className="w-7 h-7 rounded-full bg-pink-200 text-pink-600 flex items-center justify-center font-bold">
                🎯
              </span>
              <span>Finding job listings...</span>
            </div>
          )}
          {step >= 2 && (
            <div className="flex items-center space-x-3">
              <span className="w-7 h-7 rounded-full bg-green-200 text-green-600 flex items-center justify-center font-bold">
                ⚙️
              </span>
              <span>Customizing based on your preferences...</span>
            </div>
          )}
          {step >= 3 && (
            <div className="flex items-center space-x-3">
              <span className="w-7 h-7 rounded-full bg-yellow-300 text-yellow-700 flex items-center justify-center font-bold">
                🏁
              </span>
              <span>Finalizing your profile...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
