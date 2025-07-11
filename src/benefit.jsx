import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { useFormData } from './Formcontext';
import { useNavigate } from 'react-router-dom';

const categories = [
  "Unlimited or Flexible PTO", "Health Insurance", "Dental Insurance", "Vision Insurance",
  "Life Insurance", "Parental Leave", "Cell Reimbursement", "Internet Reimbursement",
  "Gym / Health Stipend", "Office Stipend", "Retirement Savings", "Continuing Education",
  "Education Assistance", "Retreats", "Mental Health Support", "Disability",
  "Dependent Health", "Paid Holidays", "Paid Illness Leave", "Paid Time Off",
  "Computer Provided", "Career Development", "Cowork Stipend", "Work From Home Stipend"
];

export default function BenefitCategorySelector() {
  const { formData, setFormData } = useFormData();
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(formData.benefits || []);
  const [visible, setVisible] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const navigate = useNavigate();

  const visibleCategories = showAll ? categories : categories.slice(0, 14);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFormData({ ...formData, benefits: selected });
  }, [selected]);

  const handleCategoryClick = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category));
    } else if (selected.length < 3) {
      setSelected([...selected, category]);
    } else {
      alert("You can select up to 3 benefits.");
    }
  };

  // 👇 This will be called by Footer on click
  const handleNextClick = async () => {
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
        const error = await response.json();
        throw new Error(error.detail || "Unknown error");
      }

      await response.json();
      setSubmitMessage("✅ Your profile was submitted successfully!");
      setTimeout(() => setSubmitMessage(null), 5000);

      // Optional: navigate("/pricing");
    } catch (error) {
      console.error("❌ Error submitting profile:", error.message);
      setSubmitMessage("❌ Failed to submit profile.");
      setTimeout(() => setSubmitMessage(null), 5000);
    }
  };

  // 👇 Attach handler to window so Footer can trigger it
  useEffect(() => {
    window.handleBenefitNext = handleNextClick;
    return () => {
      delete window.handleBenefitNext;
    };
  }, [formData]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 mt-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-300 text-[#333] rounded-[20px]">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#ea9f6f]">
        What <span className="text-[#333]">benefits</span> are important to you?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 font-medium w-full max-w-6xl">
        {visibleCategories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 transform hover:scale-105 ${
              selected.includes(category)
                ? 'bg-[#ea9f6f] text-white border-[#ea9f6f]'
                : 'border-gray-300 text-[#333] hover:bg-[#ffe8d9] hover:text-[#ea9f6f]'
            } ${visible ? 'animate-fade-down' : 'opacity-0'}`}
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
          >
            {category}
          </button>
        ))}
      </div>

      {!showAll && (
        <p
          className="text-[#ea9f6f] font-semibold text-sm mt-8 cursor-pointer hover:underline"
          onClick={() => setShowAll(true)}
        >
          Show more categories
        </p>
      )}

      {submitMessage && (
        <p className="mt-8 text-md font-medium text-center text-green-700">{submitMessage}</p>
      )}

      <Footer />
    </div>
  );
}
