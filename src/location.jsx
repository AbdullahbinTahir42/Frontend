import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useFormData } from "./Formcontext"; // ✅ Import form context

export default function WorkLocation() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormData(); // ✅ Access context

  const [location, setLocation] = useState("");
  const [locationDetected, setLocationDetected] = useState(false); // ✅ New state
  const [anywhereUS, setAnywhereUS] = useState(false);
  const [anywhereWorld, setAnywhereWorld] = useState(false);

  // ✅ Prefill location from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("resume_analysis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const detected = parsed?.detectedLocation;
        if (detected) {
          setLocation(detected);
          setLocationDetected(true); // ✅ Mark as auto-detected
        }
      } catch (err) {
        console.error("Error parsing resume_analysis", err);
      }
    }
  }, []);

  // ✅ Save data to context
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
    console.log("Skipped location");
    navigate("/work");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 text-center mt-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 animate-fade-in relative rounded-[20px] mb-3 text-white">
      <div className="max-w-xl w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-2">
          Where do you want to work from?
        </h1>
        <p className="text-gray-200 mb-6">
          It’s important to add a location because some companies target
          specific areas, but you’ll always work remotely.
        </p>

        <input
          type="text"
          placeholder="City, State or Country"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setLocationDetected(false); // ✅ User typed, so hide label
          }}
          className="w-full border text-black font-bold border-gray-300 rounded-md px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {locationDetected && (
          <p className="text-green-400 text-sm mb-3">We got this from your resume</p>
        )}

        <div className="flex items-center mb-2">
          <input
            id="us"
            type="checkbox"
            checked={anywhereUS}
            onChange={() => setAnywhereUS(!anywhereUS)}
            className="mr-2"
          />
          <label htmlFor="us">
            Include jobs where I can work from anywhere in US
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="world"
            type="checkbox"
            checked={anywhereWorld}
            onChange={() => setAnywhereWorld(!anywhereWorld)}
            className="mr-2"
          />
          <label htmlFor="world">
            Include jobs where I can work from anywhere in the world
          </label>
        </div>

        <button
          onClick={handleSkip}
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          Skip for now
        </button>
      </div>

      <Footer />
    </div>
  );
}
