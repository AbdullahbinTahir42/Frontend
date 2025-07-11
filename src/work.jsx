import React, { useState } from "react";
import Footer from "./Footer";
import { useFormData } from "./Formcontext";

export default function WorkTypeSelector() {
  const [selected, setSelected] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const { formData, setFormData } = useFormData();

  const handleSelect = (type) => {
    setSelected(type);
    setShowMessage(false);
    setFormData({ ...formData, work_type: type });
    setTimeout(() => setShowMessage(true), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 md:px-10 text-center mt-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-300 rounded-[20px] mb-3 text-[#333]">
      <div className="w-full max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        {showMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md mb-6 text-sm font-medium">
            ✅ We've found <strong>remote jobs</strong> that fit your lifestyle!
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#ea9f6f]">
          What type of work best fits your lifestyle?
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4 transition-all duration-500">
          {["Full-time", "Part-time", "Freelance"].map((type) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className={`px-5 sm:px-6 py-2 rounded-full border transition-all duration-300 transform text-sm sm:text-base font-medium ${
                selected === type
                  ? "bg-[#ea9f6f] text-white scale-105 shadow-md"
                  : "bg-white text-[#ea9f6f] border-[#ea9f6f] hover:bg-[#ea9f6f] hover:text-white hover:scale-105"
              }`}
            >
              {type} {selected === type ? "✓" : ""}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}
