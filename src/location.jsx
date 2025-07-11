import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useFormData } from "./Formcontext";

export default function WorkLocation() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormData();

  const [location, setLocation] = useState("");
  const [locationDetected, setLocationDetected] = useState(false);
  const [anywhereUS, setAnywhereUS] = useState(false);
  const [anywhereWorld, setAnywhereWorld] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("resume_analysis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const detected = parsed?.detectedLocation;
        if (detected) {
          setLocation(detected);
          setLocationDetected(true);
        }
      } catch (err) {
        console.error("Error parsing resume_analysis", err);
      }
    }
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      location: {
        place: location,
        anywhere_in_us: anywhereUS,
        anywhere_in_world: anywhereWorld,
      },
    });
  }, [location, anywhereUS, anywhereWorld]);

  const handleSkip = () => {
    navigate("/work");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 mt-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-300 px-4 rounded-[20px] text-[#333]">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#ea9f6f]">
          Where do you want to work from?
        </h1>
        <p className="text-gray-700 mb-6">
          It’s important to add a location because some companies target specific areas, 
          but you’ll always work remotely.
        </p>

        <input
          type="text"
          placeholder="City, State or Country"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setLocationDetected(false);
          }}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-1 text-black font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9f6f]"
        />

        {locationDetected && (
          <p className="text-green-600 text-sm mb-3">We got this from your resume</p>
        )}

        <div className="flex items-center mb-2 text-sm text-gray-800">
          <input
            id="us"
            type="checkbox"
            checked={anywhereUS}
            onChange={() => setAnywhereUS(!anywhereUS)}
            className="mr-2 accent-[#ea9f6f]"
          />
          <label htmlFor="us">Include jobs where I can work from anywhere in the US</label>
        </div>

        <div className="flex items-center mb-4 text-sm text-gray-800">
          <input
            id="world"
            type="checkbox"
            checked={anywhereWorld}
            onChange={() => setAnywhereWorld(!anywhereWorld)}
            className="mr-2 accent-[#ea9f6f]"
          />
          <label htmlFor="world">Include jobs where I can work from anywhere in the world</label>
        </div>

        <button
          onClick={handleSkip}
          className="text-[#ea9f6f] font-semibold hover:underline transition text-sm"
        >
          Skip for now
        </button>
      </div>

      <Footer />
    </div>
  );
}
