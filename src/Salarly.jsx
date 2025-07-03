import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import { useFormData } from './Formcontext';

export default function EarningSlider() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormData();

  // Initialize from context (if user comes back)
  const initialType = formData.salary_expectation?.type || "salary";
  const initialAmount = formData.salary_expectation?.amount || (initialType === "hourly" ? 20 : 35000);

  const [isHourly, setIsHourly] = useState(initialType === "hourly");
  const [value, setValue] = useState(initialAmount);

  // Toggle salary/hourly
  const handleToggle = (mode) => {
    const isNowHourly = mode === "hourly";
    const defaultValue = isNowHourly ? 20 : 35000;

    setIsHourly(isNowHourly);
    setValue(defaultValue);

    setFormData({
      ...formData,
      salary_expectation: {
        amount: defaultValue,
        type: isNowHourly ? "hourly" : "salary",
      },
    });
  };

  // Slider value change
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);

    setFormData({
      ...formData,
      salary_expectation: {
        amount: newValue,
        type: isHourly ? "hourly" : "salary",
      },
    });
  };

  useEffect(() => {
    console.log("Form Data (salary):", formData.salary_expectation);
  }, [formData.salary_expectation]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col justify-center items-center mt-14 rounded-[20px]">
      <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm w-full max-w-lg p-6 rounded-2xl shadow-md mx-4 animate-fade-in text-center">
        <h2 className="text-4xl font-bold mb-6">
          What's the minimum you'd like to earn?
        </h2>

        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleToggle("salary")}
            className={`px-4 py-2 rounded-l-md border ${
              !isHourly ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
          >
            Salary
          </button>
          <button
            onClick={() => handleToggle("hourly")}
            className={`px-4 py-2 rounded-r-md border ${
              isHourly ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
          >
            Hourly
          </button>
        </div>

        {/* Display */}
        <div className="text-4xl font-bold mb-2">
          ${isHourly ? value.toFixed(2) : value.toLocaleString()}
        </div>
        <div className="text-gray-300 mb-6">
          {isHourly ? "per hour" : "per year"}
        </div>

        {/* Slider */}
        <input
          type="range"
          min={isHourly ? 10 : 20000}
          max={isHourly ? 100 : 200000}
          step={isHourly ? 1 : 1000}
          value={value}
          onChange={handleChange}
          className="w-full accent-blue-600"
        />

        {/* Skip */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/location")}
            className="text-blue-400 hover:underline"
          >
            Skip for now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
