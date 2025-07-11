import React, { useState } from 'react';
import Footer from "./Footer";
import { useFormData } from './Formcontext';

const CareerLevelSelector = () => {
  const [selectedLevel, setSelectedLevel] = useState('None');
  const [displayedLevel, setDisplayedLevel] = useState('None');

  const { formData, setFormData } = useFormData();

  const handleSelect = (level) => {
    setSelectedLevel(level);
    setFormData({ ...formData, career_level: level });
    setTimeout(() => {
      setDisplayedLevel(level);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-300 px-4 text-[#333] rounded-[20px] mt-14">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg text-center">

        {displayedLevel !== 'None' && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-6 text-sm font-medium">
            Great! We have <strong>{displayedLevel}</strong> jobs for you.
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#ea9f6f]">
          What's your career level?
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className={`px-5 py-2 rounded-full border transition-all duration-300 transform font-medium ${
                selectedLevel === level
                  ? 'bg-[#ea9f6f] text-white scale-105 border-[#ea9f6f] shadow-md'
                  : 'bg-white text-[#ea9f6f] border-[#ea9f6f] hover:bg-[#ea9f6f] hover:text-white hover:scale-105'
              }`}
            >
              {selectedLevel === level ? `${level} ✓` : level}
            </button>
          ))}
        </div>

        <button className="text-[#ea9f6f] hover:underline transition text-sm font-semibold mb-6">
          Skip for now
        </button>

        <Footer />
      </div>
    </div>
  );
};

export default CareerLevelSelector;
