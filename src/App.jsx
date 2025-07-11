import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// ✅ Component imports
import Navbar from "./components/Navbar";
import HeroSection from "./index"; // ✅ Correct path to HeroSection
import HowItWorks from "./Hero";         // This is now the 2nd page
import Resume from "./Resume";
import RemoteJobSelector from "./Remote";
import JobSearchDropdown from "./JobSearch";
import JobCategorySelector from "./Category ";
import EarningSlider from "./Salarly";
import WorkLocation from "./location";
import WorkTypeSelector from "./work";
import CareerLevelSelector from "./career";
import BenefitCategorySelector from "./benefit";
import JobCard from "./JobGeneration";
import PricingPage from "./pricing";
import TermsAndConditions from "./term";
import PrivacyPolicy from "./privacy";
import CardPaymentForm from "./card";
import RegisterPage from "./Register";
import LoginPage from "./login";
import Profile from "./profile";
import JobListings from "./jobs";
import AdminPanel from "./Admin";
import PaymentForm from "./payment";

// ✅ Form Context Provider
import { FormProvider } from "./Formcontext";

// ✅ Protected Route Wrapper
function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
}

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://127.0.0.1:8000/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not logged in");
          return res.json();
        })
        .then((data) => setMessage(`Hello, ${data.full_name}`))
        .catch(() => {
          setMessage("User not logged in or token invalid");
          localStorage.removeItem("token");
        });
    }

    const clearTokenOnUnload = () => {
      localStorage.removeItem("token");
    };
    window.addEventListener("beforeunload", clearTokenOnUnload);
    return () => window.removeEventListener("beforeunload", clearTokenOnUnload);
  }, []);

  return (
    <Router>
      <FormProvider>
        <Navbar />

        <div className="px-4 py-2 bg-gray-100">
          <p className="text-gray-700">{message}</p>
        </div>

        <Routes>
          {/* ✅ Homepage now shows HeroSection */}
          <Route path="/" element={<HeroSection />} />

          {/* ✅ HowItWorks moved to /how-it-works */}
          <Route path="/how-it-works" element={<HowItWorks />} />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <Resume />
              </ProtectedRoute>
            }
          />
          <Route path="/remote-jobs" element={<RemoteJobSelector />} />
          <Route path="/JobSearch" element={<JobSearchDropdown />} />
          <Route path="/Category" element={<JobCategorySelector />} />
          <Route path="/Salarly" element={<EarningSlider />} />
          <Route path="/location" element={<WorkLocation />} />
          <Route path="/work" element={<WorkTypeSelector />} />
          <Route path="/career" element={<CareerLevelSelector />} />
          <Route path="/benefit" element={<BenefitCategorySelector />} />
          <Route path="/JobGeneration" element={<JobCard />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/term" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/card" element={<CardPaymentForm />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/payment/form" element={<PaymentForm />} />
        </Routes>
      </FormProvider>
    </Router>
  );
}

export default App;
