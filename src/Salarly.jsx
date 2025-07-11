import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import { useFormData } from './Formcontext';

export default function EarningSlider() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormData();

  const initialType = formData.salary_expectation?.type || "salary";
  const initialAmount = formData.salary_expectation?.amount || (initialType === "hourly" ? 20 : 35000);

  const [isHourly, setIsHourly] = useState(initialType === "hourly");
  const [value, setValue] = useState(initialAmount);

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
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-300 text-[#333] flex flex-col justify-center items-center mt-14 rounded-[20px] px-4">
      <div className="bg-white shadow-xl w-full max-w-lg p-6 rounded-2xl mx-4 animate-fade-in text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#ea9f6f]">
          What's the minimum you'd like to earn?
        </h2>

        {/* Toggle */}
        <div className="flex justify-center mb-6 text-sm font-medium">
          <button
            onClick={() => handleToggle("salary")}
            className={`px-5 py-2 rounded-l-md border border-[#ea9f6f] transition ${
              !isHourly
                ? "bg-[#ea9f6f] text-white"
                : "bg-white text-[#ea9f6f] hover:bg-[#fff3e5]"
            }`}
          >
            Salary
          </button>
          <button
            onClick={() => handleToggle("hourly")}
            className={`px-5 py-2 rounded-r-md border border-[#ea9f6f] transition ${
              isHourly
                ? "bg-[#ea9f6f] text-white"
                : "bg-white text-[#ea9f6f] hover:bg-[#fff3e5]"
            }`}
          >
            Hourly
          </button>
        </div>

        {/* Display */}
        <div className="text-4xl font-bold mb-2 text-[#ea9f6f]">
          ${isHourly ? value.toFixed(2) : value.toLocaleString()}
        </div>
        <div className="text-gray-700 mb-6 font-medium">
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
          className="w-full accent-[#ea9f6f]"
        />

        {/* Skip */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/location")}
            className="text-[#ea9f6f] font-semibold hover:underline text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
