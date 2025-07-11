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
      }, index * 300);
    });
  }, []);

  const handleJobSelect = (title) => {
    setFormData({ ...formData, remote_type: title });
    setShowOtherInput(false); // Hide "Other" input
  };

  return (
    <div className="flex flex-col items-center p-6 pb-32 min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200 text-[#333] mt-14">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 mt-10 text-[#ea9f6f] text-center">
        What type of remote jobs are you looking for?
      </h1>
      <p className="mb-6 text-center text-gray-600">I'm looking for...</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl">
        {jobOptions.map((job, index) => {
          const isSelected = selectedJobType === job.title;

          return (
            <div
              key={job.id}
              onClick={() => handleJobSelect(job.title)}
              className={`group cursor-pointer p-6 rounded-xl border transition-all duration-500
                ${isSelected
                  ? "bg-[#ea9f6f] text-white border-[#ea9f6f]"
                  : "bg-white text-black border-gray-200"}
                hover:scale-105 hover:shadow-2xl
                ${visibleCards.includes(index) ? "opacity-100" : "opacity-0"}`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="text-4xl mb-4 text-center">{job.icon}</div>
              <p className="text-center font-semibold">{job.title}</p>
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
          className="text-[#ea9f6f] mt-14 font-bold cursor-pointer hover:underline"
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
          className="border border-[#ea9f6f] bg-white rounded px-4 py-2 mt-6 w-full max-w-xl text-black focus:ring-2 focus:ring-[#ea9f6f]"
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
