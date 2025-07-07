import React, { useState } from "react";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    method: "",
    receipt: null,
    termsAccepted: false,
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

  if (!formData.termsAccepted) {
    alert("You must accept the terms and conditions.");
    return;
  }

  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("email", formData.email);
  payload.append("method", formData.method);
  payload.append("termsAccepted", formData.termsAccepted);
  payload.append("receipt", formData.receipt);

  try {
    const res = await fetch("http://localhost:8000/payment/submit", {
      method: "POST",
      body: payload,
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.detail || "Payment submission failed");
      return;
    }

    const data = await res.json();
    alert("Payment submitted successfully!");
    navigate("/profile"); // redirect after successful payment
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-300 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-orange-600">go</span>
          <span className="text-xl font-semibold text-black">Online</span>
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
        />

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 rounded-md border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />

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
          className="block w-full text-sm text-gray-700 bg-white border border-orange-300 rounded-md cursor-pointer mb-4"
        />

        {/* Terms Checkbox */}
        <label className="flex items-center space-x-2 text-sm text-gray-700 mb-4">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="w-4 h-4 border-gray-300"
          />
          <span>Terms and Condition accepted</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}