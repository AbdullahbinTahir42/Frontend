import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { useFormData } from './Formcontext'; // ✅ Import form context

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
  const [selected, setSelected] = useState(formData.benefits_list || []);
  const [visible, setVisible] = useState(false);

  const visibleCategories = showAll ? categories : categories.slice(0, 14);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Update context whenever selected changes
  useEffect(() => {
    setFormData({ ...formData, benefits: selected });
  }, [selected]);

  const handleCategoryClick = (category) => {
    if (selected.includes(category)) {
      const filtered = selected.filter((item) => item !== category);
      setSelected(filtered);
    } else if (selected.length < 3) {
      setSelected([...selected, category]);
    } else {
      alert("You can select up to 3 benefits from the company.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 text-center mt-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 animate-fade-in relative rounded-[20px] mb-3 text-white">
      <h2 className="text-2xl font-bold mb-6">
         <span className="text-blue-600">What benefits </span> are important to you?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 justify-items-center font-bold">
        {visibleCategories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full border text-sm transition duration-300 transform hover:scale-105 ${
              selected.includes(category)
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow"
            } ${visible ? "animate-fade-down" : "opacity-0"}`}
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
          >
            {category} <span className="text-sm font-bold">+</span>
          </button>
        ))}
      </div>

      {!showAll && (
        <p
          className="text-blue-600 text-sm mt-6 cursor-pointer hover:underline font-bold"
          onClick={() => setShowAll(true)}
        >
          Show more categories
        </p>
      )}

      <Footer />
    </div>
  );
}
