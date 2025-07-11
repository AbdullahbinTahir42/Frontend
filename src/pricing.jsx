import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import resumeweb from "../src/assets/resume web.png";

export default function PricingPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState(20);

  useEffect(() => {
    let current = 20;
    const interval = setInterval(() => {
      current += Math.floor((2033 - current) / 15) + 1;
      if (current >= 2033) {
        current = 2033;
        clearInterval(interval);
      }
      setCount(current);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-yellow-100 to-yellow-200 text-gray-800 overflow-hidden min-h-screen pt-10 px-6">
      <div className="text-center mb-10">
        <p className="text-3xl font-bold bg-[#ea9f6f] text-white p-4 rounded-[20px] shadow-lg inline-block mt-5">
          Join today to be an <strong>early applicant</strong> for
          <span className="bg-white text-[#ea9f6f] font-bold mx-2 px-2 py-1 rounded">
            {count.toLocaleString()}
          </span>
          jobs!
        </p>
        <h1 className="text-4xl font-bold mt-4 text-[#ea9f6f]">
          Access All 17,600+ Verified Jobs
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-6xl mx-auto">
        {/* Plan B */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white border border-yellow-300 rounded-2xl p-6 shadow hover:shadow-lg w-full md:w-1/3"
        >
          <h3 className="text-xl font-bold text-gray-700 mb-1">Plan B</h3>
          <h2 className="text-lg font-bold text-[#ea9f6f] mb-2">14-Day Full Access</h2>
          <p className="text-2xl font-bold text-[#ea9f6f] mb-4">$2.95 (836PKR)</p>
          <ul className="text-sm list-disc ml-5 space-y-2 text-gray-700">
            <li>Explore remote jobs in 45+ categories</li>
            <li>Find local jobs around the world</li>
            <li>No scams, no spam — just real jobs</li>
            <li>Auto-renews at $23.95 after 14 days</li>
            <li>Cancel anytime</li>
          </ul>
          <button
            onClick={() => {
              localStorage.setItem("selectedPlan", "14-Day Full Access");
              navigate("/Payment/Form");
            }}
            className="mt-4 bg-[#ea9f6f] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Continue
          </button>
        </motion.div>

        {/* What You Get */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#ea9f6f] text-white rounded-2xl p-6 shadow-xl w-full md:w-1/3 text-center"
        >
          <h2 className="text-xl font-bold mb-4">What You Get</h2>
          <ul className="space-y-4 text-left text-white text-sm">
            <li><strong>Exclusive Curated Jobs</strong></li>
            <li><strong>Effortless Browsing</strong></li>
            <li>
              <span className="text-yellow-200">Also Included!</span><br />
              <strong>Professional Resume Review</strong>
            </li>
            <li>
              <strong>Money-Back Guarantee</strong><br />
              <span className="text-white text-xs">Full refund if not satisfied in 14 days</span>
            </li>
          </ul>
          <button
            onClick={() => {
              localStorage.setItem("selectedPlan", "Featured Plan");
              navigate("/Payment/Form");
            }}
            className="mt-6 bg-white text-[#ea9f6f] px-6 py-2 rounded font-semibold hover:bg-yellow-100"
          >
            Continue
          </button>
        </motion.div>

        {/* Plan A */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white border border-yellow-300 rounded-2xl p-6 shadow hover:shadow-lg w-full md:w-1/3"
        >
          <h3 className="text-xl font-bold text-gray-700 mb-1">Plan A</h3>
          <div className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full inline-block mb-2">
            Best value
          </div>
          <h2 className="text-lg font-bold text-[#ea9f6f] mb-2">6-Month Full Access</h2>
          <p className="text-xl font-bold text-[#ea9f6f] mb-4">$11.0 (3120PKR) / Month</p>
          <ul className="text-sm list-disc ml-5 space-y-2 text-gray-700">
            <li>Save 53% across your job search</li>
            <li>Keep listings and take control</li>
            <li>No scams, no spam — just real jobs</li>
            <li>Auto-renews every 6 months at $71.70</li>
            <li>Cancel anytime</li>
          </ul>
          <button
            onClick={() => {
              localStorage.setItem("selectedPlan", "6-Month Full Access");
              navigate("/Payment/Form");
            }}
            className="mt-4 bg-[#ea9f6f] text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Continue
          </button>
        </motion.div>
      </div>

      {/* Resume Review Section */}
      <div className="mt-20 flex flex-col md:flex-row items-center gap-10 bg-white rounded-xl p-10 max-w-6xl mx-auto shadow">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#ea9f6f] mb-2">
            Get a Professional Resume Review
          </h2>
          <p className="text-gray-700 text-base">
            Let a resume analyst review and validate your resume to help you land more interviews.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={resumeweb}
            alt="Resume Review"
            className="rounded-xl w-full max-w-md mx-auto"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#ea9f6f] text-white text-center py-6 mt-14 w-full rounded-[20px]">
        <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
          <a href="/term" className="hover:underline" target="blank">
            Terms & Conditions |
          </a>
          <a href="/privacy" className="hover:underline" target="blank">
            | Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
