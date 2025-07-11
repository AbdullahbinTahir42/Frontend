import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import { useFormData } from './Formcontext';

const categories = [
  "Accounting", "Administrative Assistant", "Analyst", "Bookkeeping",
  "Call Center", "Chat Support", "Communications", "Compliance",
  "Consulting", "Copywriting", "Creative", "Criminal Justice",
  "Customer Service", "Cybersecurity", "Data Analyst", "Data Entry", "Data Science",
  "Design", "Developer", "Editing", "Education", "Environmental", "Finance", "Graphic Design",
  "Healthcare", "Higher Care", "Hospitality", "Human Resources", "IT", "Legal", "Life Coach",
  "Live chat", "Marketing", "Medical", "Nonprofit", "Nursing", "Procurement", "Product Manager",
  "Project Management", "Proofreading", "Public Health", "QA", "Recruiter", "RN", "Sales", "Social Media",
  "Software Engineering", "Training", "Transcription"
];

export default function JobCategorySelector() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [visible, setVisible] = useState(false);
  const { formData, setFormData } = useFormData();
  const navigate = useNavigate();

  const visibleCategories = showAll ? categories : categories.slice(0, 14);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFormData({ ...formData, skills: selected });
  }, [selected]);

  const handleCategoryClick = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category));
    } else if (selected.length < 3) {
      setSelected([...selected, category]);
    } else {
      alert("You can only select up to 3 categories.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-center mt-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-300 rounded-[20px] text-[#333]">
      <h2 className="text-2xl font-bold mb-6">
        Pick <span className="text-[#ea9f6f]">up to 3 job categories</span> that spark your interest.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center font-bold">
        {visibleCategories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full border text-sm transition duration-300 transform hover:scale-105 ${
              selected.includes(category)
                ? "bg-[#ea9f6f] text-white border-[#ea9f6f]"
                : "border-gray-300 hover:bg-[#fdebd2] hover:text-[#ea9f6f]"
            } ${visible ? "animate-fade-down" : "opacity-0"}`}
            style={{
              animationDelay: `${idx * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {category} <span className="text-sm font-bold">+</span>
          </button>
        ))}
      </div>

      {!showAll && (
        <p
          className="text-[#ea9f6f] text-sm mt-6 cursor-pointer hover:underline font-bold"
          onClick={() => setShowAll(true)}
        >
          Show more categories
        </p>
      )}

      <p className="mt-4 text-sm text-gray-700 font-bold mb-4">
        Selected: {selected.join(', ') || 'None'}
      </p>

      <Footer />
    </div>
  );
}
