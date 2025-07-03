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
          navigate("/profile"); // redirect to profile after submit
        } catch (error) {
          console.error("❌ Error submitting form data:", error.message);
        }
      };

      submitData();
    }
  }, [showResults, formData, navigate]);

  if (!showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-600 via-gray-800 to-gray-900 px-4 text-white mt-8 rounded-[20px]">
        {showCircle && (
          <div
            className="w-20 h-20 border-8 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"
            style={{ animationDuration: "3s" }}
          />
        )}
        <h2 className="text-2xl font-bold mb-6">Generating your Profile</h2>
        <div className="flex flex-col items-start space-y-4">
          {step >= 1 && (
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center">
                🎯
              </span>
              <span>Finding listings</span>
            </div>
          )}
          {step >= 2 && (
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                ⚙️
              </span>
              <span>Customizing by Preferences</span>
            </div>
          )}
          {step >= 3 && (
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                🏁
              </span>
              <span>Finalizing List</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // We don't show anything here after loading because of redirect
  return null;
}
