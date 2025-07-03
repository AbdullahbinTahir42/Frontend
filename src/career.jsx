import React, { useState } from 'react';
import Footer from "./Footer";
import { useFormData } from './Formcontext'; // ✅ Import context

const CareerLevelSelector = () => {
  const [selectedLevel, setSelectedLevel] = useState('None');
  const [displayedLevel, setDisplayedLevel] = useState('None');

  const { formData, setFormData } = useFormData(); // ✅ Access form data context

  const handleSelect = (level) => {
    setSelectedLevel(level);
    setFormData({ ...formData, career_level: level }); // ✅ Save to context
    setTimeout(() => {
      setDisplayedLevel(level);
    }, 1000); // Show message after 1 second
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 px-4 text-white">
      <div className="max-w-xl w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl shadow">

        {displayedLevel !== 'None' && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-6 text-sm font-medium animate-fade-in">
            Great! We have <strong>{displayedLevel}</strong> jobs for you.
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">What's your career level?</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`px-5 py-2 rounded-full border transition-all duration-300 transform ${
                selectedLevel === level
                  ? 'bg-white text-blue-700 scale-110 shadow-md font-semibold border-blue-500'
                  : 'bg-transparent text-white hover:bg-white hover:text-black hover:scale-105 border-gray-300'
              }`}
            >
              {selectedLevel === level ? `${level} ✓` : level}
            </button>
          ))}
        </div>

        <button className="text-blue-400 hover:underline transition mb-8">
          Skip for now
        </button>

        <Footer />
      </div>
    </div>
  );
};

export default CareerLevelSelector;
