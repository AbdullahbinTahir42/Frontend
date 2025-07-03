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

  const companies = ["twilio", "mozilla", "lyft", "peloton", "reddit"];
  const testimonials = [
    {
      quote: "Very easy to navigate and apply. I found what I was looking for in a job.",
      name: "Maria S.",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
      bg: "bg-pink-100",
      quoteColor: "text-pink-300",
    },
    {
      quote: "Such a cool site!! Thank you!!",
      name: "Denita G.",
      img: "https://randomuser.me/api/portraits/women/60.jpg",
      bg: "bg-green-100",
      quoteColor: "text-green-300",
    },
    {
      quote: "I loved how there weren’t any scams or links that sent me to more job websites.",
      name: "Shelby L.",
      img: "https://randomuser.me/api/portraits/women/61.jpg",
      bg: "bg-red-100",
      quoteColor: "text-red-300",
    },
  ];

  return (
    <div className="bg-white text-gray-800 overflow-hidden">
      {/* ========== SECTION 1: PRICING ========== */}
      <div className="p-6 md:p-12">
        <div className="text-center mb-8">
          <p className="text-3xl font-bold bg-blue-700 p-4 text-white rounded-[20px] mt-3 shadow-lg">
            Join today to be an <strong>early applicant</strong> for
            <span className="bg-blue-100 text-blue-800 font-bold mx-2 px-2 py-1 rounded">
              {count.toLocaleString()}
            </span>
            jobs!
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-4">
            Access All 17,600+ Verified Jobs
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 relative z-0">
          {/* Left Plan */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 p-6 border-2 rounded-2xl shadow hover:shadow-lg cursor-pointer bg-white z-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked readOnly className="w-5 h-5 accent-blue-600" />
              <span className="text-lg font-semibold">14-Day Full Access</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">$2.95</p>
            <ul className="mt-4 text-sm list-disc ml-6 space-y-2">
              <li>Explore remote jobs in 45+ categories</li>
              <li>Find local jobs around the world</li>
              <li>No scams, no spam — just real jobs</li>
              <li>Auto-renews at $23.95 after 14 days</li>
              <li>Cancel anytime</li>
            </ul>
          </motion.div>

          {/* Middle (Featured Plan) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 bg-blue-700 text-white p-6 rounded-2xl shadow-xl text-center scale-105 z-10 relative"
          >
            <h2 className="text-xl font-bold mb-4">What You Get</h2>
            <ul className="space-y-4 text-left">
              <li><span className="font-semibold">Exclusive Curated Jobs</span></li>
              <li><span className="font-semibold">Effortless Browsing</span></li>
              <li>
                <span className="text-sm text-pink-300">Also Included!</span><br />
                <span className="font-semibold">Professional Resume Review</span>
              </li>
              <li>
                <span className="font-semibold">Money-Back Guarantee</span><br />
                <span className="text-sm">Full refund if not satisfied in 14 days</span>
              </li>
            </ul>
            <button
              onClick={() => navigate("/card")}
              className="mt-6 bg-lime-400 hover:bg-lime-500 text-black px-6 py-2 rounded-xl font-semibold"
            >
              Continue
            </button>
          </motion.div>

          {/* Right Plan */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/3 p-6 border-2 rounded-2xl shadow hover:shadow-lg cursor-pointer bg-white z-0 relative"
          >
            <div className="absolute top-2 right-2 bg-pink-200 text-pink-800 text-xs px-2 py-1 rounded-full font-bold">
              Best value
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" className="w-5 h-5 accent-pink-600" />
              <span className="text-lg font-semibold">6-Month Full Access</span>
            </div>
            <p className="text-2xl font-bold text-pink-700">
              $11.95<span className="text-base">/Month</span>
            </p>
            <ul className="mt-4 text-sm list-disc ml-6 space-y-2">
              <li>Save 53% across your job search</li>
              <li>Keep listings and take control</li>
              <li>No scams, no spam — just real jobs</li>
              <li>Auto-renews every 6 months at $71.70</li>
              <li>Cancel anytime</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ========== SECTION 2: TESTIMONIALS ========== */}
      <div className="py-16 px-4 md:px-16 text-center bg-white">
        <h2 className="text-2xl md:text-4xl font-bold mb-8">Top Companies Hiring Remotely</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
          {companies.map((name, i) => (
            <img
              key={i}
              src={`https://logo.clearbit.com/${name}.com`}
              alt={name}
              className="h-8 md:h-10"
            />
          ))}
        </div>

        <h2 className="text-2xl md:text-4xl font-bold mb-10">Why Job Seekers Love Our Listings</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl ${item.bg} text-black flex flex-col items-center shadow-lg`}
            >
              <div className={`text-5xl ${item.quoteColor} mb-4`}>“</div>
              <p className="mb-6 font-medium text-center">{item.quote}</p>
              <img
                src={item.img}
                alt={item.name}
                className="w-12 h-12 rounded-full border-2 border-white mb-2"
              />
              <p className="text-sm font-semibold">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SECTION 3: RESUME REVIEW ========== */}
      <div className="bg-white py-20 px-6 md:px-20 text-center flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get a Professional Resume Review
          </h2>
          <p className="text-gray-600 text-lg font-bold">
            Let a resume analyst review and validate your resume to help you land more interviews.
          </p>
          <p>Let a resume analyst review and validate your resume to help you land more interviews.</p>
        </div>
 <div className="md:w-1/2">
  <img
    src={resumeweb}
    alt="Resume Review"
    className="rounded-xl w-full max-w-md mx-auto"
  />
</div>

</div>

      

        {/* ========== SECTION 2: TESTIMONIALS ========== */}
      <footer className="bg-blue-700 text-white text-center py-6 mt-10 w-full rounded-[20px]">
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
