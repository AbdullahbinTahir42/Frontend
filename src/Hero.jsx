import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./Register"; 


const HowItWorks = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const steps = [
    {
      icon: "📝",
      title: "Step 1",
      desc: (
        <>
          <span className="font-bold">Answer a Few Simple Questions, </span>
          and we’ll pick the best matches for you
        </>
      ),
    },
    {
      icon: "💻",
      title: "Step 2",
      desc: (
        <>
          <span className="font-bold">Easily Apply </span>
          to jobs you like and monitor them on your dashboard System.
        </>
      ),
    },
    {
      icon: "🚀",
      title: "Step 3",
      desc: (
        <>
          <span className="font-bold">Start Your Remote Work Life </span>
          at a company that understands your needs.
        </>
      ),
    },
  ];

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(true), 500);
    const modalTimer = setTimeout(() => setShowRegisterModal(true), 2000);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(modalTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRegisterSuccess = () => {
    setIsRegistered(true);
    setShowRegisterModal(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/resume");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white via-yellow-100 to-yellow-300">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#ea9f6f] z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-[#ea9f6f] text-white px-6 py-3 rounded-lg shadow-lg z-50">
          🎉 Your journey starts now!
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && !isRegistered && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onClose={() => setShowRegisterModal(false)}
          />
        </div>
      )}

      {/* Page Content */}
      <div
        className={`flex-grow text-center py-10 px-4 transition-opacity duration-1000 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
       <h2 className="text-3xl sm:text-4xl sm:p-5 font-bold mb-10 mt-12 text-[#ea9f6f]">
  Quality Remote Jobs in Just 3 Steps
</h2>


        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-8 sm:gap-10 mb-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full sm:w-64 px-4 transition-all duration-700 transform animate-fade-down"
              style={{
                animationDelay: `${index * 300}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-3xl text-[#ea9f6f] hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#ea9f6f]">
                {step.title}
              </h3>
              <p className="text-sm mt-2 text-gray-700">{step.desc}</p>
            </div>
          ))}
        </div>

        <button
          className="bg-white text-[#ea9f6f] border border-[#ea9f6f] hover:bg-[#ea9f6f] hover:text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-sm"
        >
          Don't Miss Your Chance to Apply
        </button>
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default HowItWorks;
