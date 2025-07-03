// HowItWorks.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./Register"; // ✅ Make sure file exists

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
      desc: <> <span className="font-bold">Answer a Few Simple Questions, </span> and we’ll pick the best matches for you </>,
      bg: "bg-pink-100",
    },
    {
      icon: "💻",
      title: "Step 2",
      desc: <> <span className="font-bold">Easily Apply </span> to jobs you like and monitor them on your dashboard System. </>,
      bg: "bg-blue-100",
    },
    {
      icon: "🚀",
      title: "Step 3",
      desc: <> <span className="font-bold">Start Your Remote Work Life </span> at a company that understands your needs. </>,
      bg: "bg-red-100",
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
    <div className="min-h-screen flex flex-col relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-green-500 z-50" style={{ width: `${scrollProgress}%` }} />

      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-lime-400 text-black px-6 py-3 rounded-lg shadow-lg z-50">
          🎉 Your journey starts now!
        </div>
      )}

      {/* Modal */}
      {showRegisterModal && !isRegistered && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Register to Continue</h2>
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className={`flex-grow text-center py-10 px-4 bg-white transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 mt-6">Quality Remote Jobs in Just 3 Steps</h2>

        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-8 sm:gap-10 mb-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full sm:w-64 px-4 transition-all duration-700 transform animate-fade-down"
              style={{ animationDelay: `${index * 300}ms`, animationFillMode: "forwards" }}
            >
              <div className={`w-20 h-20 flex items-center justify-center rounded-full ${step.bg} text-3xl hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm mt-2 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        <button
          className="bg-lime-300 hover:bg-lime-400 text-black font-semibold py-2 px-6 rounded-full transition-all duration-300"
          disabled
        >
          Don't Miss Your Chance to Apply
        </button>
      </div>

      <footer className="bg-[#f8f6ef] w-full text-black text-center p-7 sm:px-8">
        <div className="space-y-2 sm:space-y-0 sm:space-x-4">
          <a href="./term" className="hover:underline" target="_blank">Terms and Conditions</a>
          <span className="hidden sm:inline">|</span>
          <a href="./privacy" className="hover:underline" target="_blank">Privacy Policy</a>
        </div>
        <p className="mt-2 text-sm">© 2025, Sonaga Tech Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HowItWorks;
