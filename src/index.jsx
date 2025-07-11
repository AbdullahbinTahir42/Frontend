import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate
import womanImg from "./assets/woman-laptop (1).png";
import uber from "./assets/uber.png";
import google from "./assets/Google.png";
import social from "./assets/social.jpg";
import amazon from "./assets/amazon.png";
import phoneImg from "./assets/phone-user.png";
import first from "./assets/first.png";
import second from "./assets/second.png";
import third from "./assets/third.png";

export default function HeroSection() {
  const navigate = useNavigate(); // ✅ 2. Initialize navigate

  return (
    <div className="bg-gradient-to-r from-yellow-200 to-orange-300  min-h-screen flex flex-col items-center">
      {/* Navbar with Logo + Login Button */}
      <div className="w-full flex justify-end items-center px-6 pt-10">
        <button  onClick={() => navigate("/login")}
        className="bg-orange-400 text-white px-5 py-2 rounded-md hover:bg-orange-500 font-semibold mt-9">
          Log In
        </button>
      </div>

      {/* Hero Content */}
    <div className="flex flex-col-reverse lg:flex-row items-center px-6 lg:px-24 gap-4 w-full h-[290px] mt-10 mb-0">
  <div className="flex-1 text-center lg:text-left">
    <h2 className="text-5xl font-extrabold text-white drop-shadow-lg mb-6">
      GET YOUR <br /> REMOTE JOB <br /> TODAY!
    </h2>
    <button
      onClick={() => navigate("/how-it-works")}
      className="mt-4 px-6 py-3 bg-white text-orange-500 rounded-md font-semibold hover:bg-orange-300 transition"
    >
      Remote Jobs
    </button>
  </div>
  <div className="flex-1 relative flex justify-center items-center">
    <img
      src={womanImg}
      alt="Happy woman with laptop"
      className="w-full h-auto max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto"
    />
  </div>
</div>


      {/* Company Logos */}
      <div className="w-full text-center mt-6 bg-white py-6">
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <img src={social} alt="social" className="w-20" />
          <img src={uber} alt="uber" className="w-20" />
          <img src={google} alt="google" className="w-20" />
          <img src={amazon} alt="amazon" className="w-20" />
        </div>
        <p className="text-sm font-medium text-gray-700 mt-4">
          100+ Companies Looking For remote talent like you
        </p>
      </div>

      {/* 🔥 New Section Start */}
      <div className="w-full bg-white py-12 px-6 md:px-20">
        {/* Top Boxes with Images */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          {[first, second, third].map((img, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-orange-100 to-orange-400 rounded-xl p-5 flex justify-center items-center w-full md:w-1/3 shadow-md h-40"
            >
              <img
                src={img}
                alt={`box-${idx}`}
                className="h-200 w-200 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Text + Image Row */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-orange-600 mb-4">
              Freshers can also do Jobs on Mobile as Part time
            </h3>
            <p className="text-gray-700 leading-relaxed">
              At Go Online Jobs, we understand that not everyone has access to
              high-end resources—but that shouldn't stop you from building your
              future. That’s why we offer remote job and internship opportunities
              that can easily be done from your mobile phone at home. Whether
              you’re a student or a fresh individual looking to start your career,
              our platform is here to help you learn, earn, and grow—no laptop needed.
            </p>
          </div>
          <div className="flex-1">
            <img
              src={phoneImg}
              alt="Mobile user"
              className="w-64 md:w-72 mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Start Today Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/how-it-works")} // ✅ Navigate to Hero
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Start Today
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-white w-full py-8 px-6 md:px-20 text-sm text-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left text-bold">
          <div className="space-y-2">
            <p>About go.online</p>
            <p>Find Remote Jobs</p>
            <p>How Goonline.io Works</p>
            <p>FAQ</p>
          </div>
          <div className="space-y-2">
            <p>Policies</p>
            <p>Privacy Policy</p>
            <p>Terms of Use</p>
            <p>CCPA/GDPR</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Customer Support</p>
            <p>1-800-510-8550</p>
            <p>Mon–Fri 9 AM - 6 PM CST</p>
            <p>support@go.online</p>
            <p>Contact Us</p>
            <p>Job Search Vigilance</p>
          </div>
        </div>
      </footer>

      {/* Bottom Footer */}
  <footer className="bg-orange-400 w-full text-white rounded-[20px] text-center p-7 sm:px-8">
  <div className="space-y-2 sm:space-y-0 sm:space-x-4">
    <a href="/term" className="hover:underline" target="_blank">
      Terms & Conditions
    </a>
    <span className="hidden sm:inline">|</span>
    <a href="/privacy" className="hover:underline" target="_blank">
      Privacy Policy
    </a>
  </div>

  <p className="mt-2 text-sm">
    © 2025 Sonaga Tech Limited. All rights reserved.
  </p>

  <p className="text-sm mt-1 font-medium">
    Developed by{" "}
    <a
      href="https://github.com/Mudassir804?tab=repositories"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-white"
    >
      Mudassir Ahmed
    </a>{" "}
    (Frontend) &{" "}
    <a
      href="https://github.com/AbdullahbinTahir42"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-white"
    >
      Abdullah bin Tahir
    </a>{" "}
    (Backend)
  </p>
</footer>



    </div>
  );
}
