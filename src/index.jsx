import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-yellow-200 to-orange-300 min-h-screen flex flex-col">
      
      {/* Navbar */}
      <header className="w-full flex justify-between mt-12 items-center px-4 sm:px-6 py-6 sm:py-6 bg-gradient-to-r from-yellow-200 to-orange-300 z-10">
        <div className="text-xl font-bold text-white"></div>
        <button
          onClick={() => navigate("/login")}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 font-semibold text-sm sm:text-base"
        >
          Log In
        </button>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col-reverse lg:flex-row items-center px-6 lg:px-24 gap-4 w-full h-[340px] mt-10 mb-0">
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
      <div className="w-full text-center bg-white py-6 sm:py-8">
        <div className="flex justify-center items-center gap-4 sm:gap-10 flex-wrap px-4">
          <img src={social} alt="social" className="w-16 sm:w-20" />
          <img src={uber} alt="uber" className="w-16 sm:w-20" />
          <img src={google} alt="google" className="w-16 sm:w-20" />
          <img src={amazon} alt="amazon" className="w-16 sm:w-20" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-4">
          100+ Companies Looking For remote talent like you
        </p>
      </div>

      {/* Feature Boxes + Mobile Info Section */}
      <section className="w-full bg-white py-10 px-4 sm:px-6 md:px-20">
        {/* Feature Boxes */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 mb-10">
          {[first, second, third].map((img, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-orange-100 to-orange-400 rounded-xl p-4 sm:p-6 flex justify-center items-center w-full md:w-1/3 h-32 sm:h-40 shadow-md"
            >
              <img src={img} alt={`feature-${idx}`} className="h-24 sm:h-32 object-contain" />
            </div>
          ))}
        </div>

        {/* Mobile-friendly Info Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-orange-600 mb-4">
              Freshers can also do Jobs on Mobile as Part time
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              At Go Online Jobs, we understand that not everyone has access to high-end
              resources—but that shouldn't stop you from building your future. That's why
              we offer remote job and internship opportunities that can easily be done
              from your mobile phone at home. Whether you're a student or a fresh
              individual looking to start your career, our platform is here to help you
              learn, earn, and grow—no laptop needed.
            </p>
          </div>
          <div className="flex-1 mt-4 md:mt-0">
            <img
              src={phoneImg}
              alt="Mobile user"
              className="w-48 sm:w-64 md:w-72 mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/how-it-works")}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Start Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white w-full py-8 px-4 sm:px-6 md:px-20 text-xs sm:text-sm text-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      <footer className="bg-orange-400 w-full text-white text-center p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <a href="/term" className="hover:underline text-xs sm:text-sm" target="_blank">
            Terms & Conditions
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="/privacy" className="hover:underline text-xs sm:text-sm" target="_blank">
            Privacy Policy
          </a>
        </div>
        <p className="mt-2 text-xs sm:text-sm">
          © 2025 Sonaga Tech Limited. All rights reserved.
        </p>
        <p className="text-xs sm:text-sm mt-1 font-medium">
          Developed by{" "}
          <a
            href="https://github.com/Mudassir804?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Mudassir Ahmed
          </a>{" "}
          &{" "}
          <a
            href="https://github.com/AbdullahbinTahir42"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Abdullah bin Tahir
          </a>{" "}
        </p>
      </footer>
    </div>
  );
}
