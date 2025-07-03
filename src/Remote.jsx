import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { useFormData } from "./Formcontext";

const jobOptions = [
  {
    id: 1,
    title: "Any Remote Job",
    icon: "🎧",
    desc: "Easy-to-start jobs that don't require specialized skills, but I'm not sure what fits me.",
  },
  {
    id: 2,
    title: "Entry Level Remote Jobs",
    icon: "🎓",
    desc: "Graduating and looking for a job in my specific field.",
  },
  {
    id: 3,
    title: "Career Specific Remote Jobs",
    icon: "🩺",
    desc: "I have experience and am looking for the next role in my field.",
  },
  {
    id: 4,
    title: "Extra Income from a Remote Job",
    icon: "💵",
    desc: "I'm looking to supplement my income.",
  },
];

function RemoteJobSelector() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const { formData, setFormData } = useFormData();
  const selectedJobType = formData.remote_type;

  useEffect(() => {
    jobOptions.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index]);
      }, index * 1000);
    });
  }, []);

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  const handleJobSelect = (title) => {
    setFormData({ ...formData, remote_type: title });
    setShowOtherInput(false); // hide "Other" input
  };

  return (
    <div className="flex flex-col items-center p-6 pb-32 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white mt-14 rounded-[20px]">
      <h1 className="text-2xl font-bold mb-2 mt-14 text-center">
        What type of remote jobs are you looking for?
      </h1>
      <p className="mb-6 text-center">I'm looking for...</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl">
        {jobOptions.map((job, index) => {
          const isSelected = selectedJobType === job.title;

          return (
            <div
              key={job.id}
              onClick={() => handleJobSelect(job.title)}
              className={`group cursor-pointer p-6 rounded-lg border shadow-md transition-all duration-500
                ${isSelected ? "bg-green-100 border-green-500" : "bg-white text-black"}
                hover:scale-105 hover:bg-neutral-200 hover:shadow-2xl hover:shadow-neutral-500
                ${visibleCards.includes(index) ? "animate-fade-down" : "opacity-0"}`}
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="text-4xl mb-4 text-center">{job.icon}</div>
              <p className="text-center font-medium">{job.title}</p>
              <div
                className={`overflow-hidden max-h-0 opacity-0 
                  group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-4 
                  transition-all duration-500 ease-in-out`}
              >
                <p className="text-sm text-gray-600">{job.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {!showOtherInput && (
        <p
          className="text-blue-400 mt-14 font-bold cursor-pointer"
          onClick={() => {
            setShowOtherInput(true);
            setFormData({ ...formData, job_type: "" });
          }}
        >
          Other
        </p>
      )}

      {showOtherInput && (
        <input
          type="text"
          placeholder="How would you describe what you're looking for?"
          className="border border-gray-400 rounded px-4 py-2 mt-14 w-full max-w-xl text-black"
          value={formData.job_type}
          onChange={(e) =>
            setFormData({ ...formData, job_type: e.target.value })
          }
        />
      )}

      <Footer />
    </div>
  );
}

export default RemoteJobSelector;
