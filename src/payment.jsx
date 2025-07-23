import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    method: "",
    receipt: null,
    termsAccepted: false,
    plan: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePaymentSelect = (method) => {
    setFormData({ ...formData, method });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked - Starting payment submission process");

    // Validate all required fields
    console.log("Current form data:", formData);

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!formData.plan) {
      alert("Please select a plan.");
      return;
    }

    if (!formData.method) {
      alert("Please select a payment method.");
      return;
    }

    if (!formData.receipt) {
      alert("Please upload a receipt.");
      return;
    }

    if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    console.log("All validations passed - Preparing API call");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      
      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      console.log("Token found - Preparing form data payload");

      // Prepare form data AFTER all validations
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("method", formData.method);
      payload.append("plan", formData.plan);
      payload.append("termsAccepted", formData.termsAccepted.toString());
      payload.append("receipt", formData.receipt);

      // Log payload contents
      console.log("Payload prepared with following data:");
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      console.log("Making API call to:", "https://api.hr.growvy.online/payment/submit");

      const res = await fetch("https://api.hr.growvy.online/payment/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: payload,
      });

      console.log("API response status:", res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: "Unknown error occurred" }));
        console.log("API error response:", data);
        
        // Handle different error status codes
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        } else if (res.status === 400) {
          alert(data.detail || "Validation error. Please check your input.");
          return;
        } else if (res.status === 404) {
          alert(data.detail || "User profile not found. Please create a profile first.");
          return;
        } else {
          alert(data.detail || `Error ${res.status}: Payment submission failed`);
          return;
        }
      }

      const data = await res.json();
      console.log("Payment submission successful:", data);
      alert("🎉 Payment submitted successfully! Your payment is being verified.");
      navigate("/profile");
      
    } catch (err) {
      console.error("Payment submission error:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        alert("Network error. Please check your internet connection and try again.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white mt-7 to-yellow-300 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-4 text-center mt-9">
          <span className="text-2xl font-bold text-orange-600"></span>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-orange-500 mb-4">Payment</h2>

        {/* Name Field */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-3 rounded-md border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          required
        />

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 rounded-md border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
          required
        />

        {/* Plan Selection */}
        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 rounded-md border border-orange-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          required
        >
          <option value="">Select a Plan</option>
          <option value="Plan A">Premium (Featured Plan)</option>
          <option value="Plan B">Standard (14-Day Full Access)</option>
        </select>

        {/* Payment Instruction */}
        <div className="bg-white text-orange-600 text-sm p-3 rounded-md mb-4 border border-orange-300 shadow">
          Please make your payment to this number:
          <br />
          <strong className="text-lg text-[#ea9f6f]">+92 3064257447</strong>
          <p>Danial Manzoor</p>
        </div>

        {/* Payment Method Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {["Jazzcash", "Easypaisa", "Sadapay", "Nayapay"].map((method) => (
            <button
              type="button"
              key={method}
              onClick={() => handlePaymentSelect(method)}
              className={`py-2 px-2 rounded-md border ${
                formData.method === method
                  ? "bg-orange-500 text-white"
                  : "bg-white text-black hover:bg-orange-100"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Upload Receipt */}
        <input
          type="file"
          name="receipt"
          onChange={handleChange}
          accept=".jpg,.jpeg,.png,.pdf"
          className="block w-full text-sm text-gray-700 bg-white border border-orange-300 rounded-md cursor-pointer mb-4"
          required
        />

        {/* Terms Checkbox */}
        <label className="flex items-center space-x-2 text-sm text-gray-700 mb-4">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="w-4 h-4 border-gray-300"
            required
          />
          <span>Terms and Condition accepted</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          Submit Payment
        </button>

        {/* Go to Profile (Optional Navigation) */}
        <button
          type="button"
          onClick={() => navigate("/JobGeneration")}
          className="w-full mt-3 py-2 rounded-md bg-orange-200 text-orange-700 hover:bg-orange-300 transition"
        >
          Skip to Profile Page
        </button>
      </form>
    </div>
  );
}