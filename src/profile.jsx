import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiFileText,
  FiBriefcase,
  FiCode,
  FiDollarSign,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";

function ProfileCard({ icon, title, items }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-50 p-2 rounded-lg mr-3">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-md text-gray-600 font-medium">{item.label}</p>
            <p className="text-gray-900 font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    setLoading(true);
    fetch("http://localhost:8000/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch profile details");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 bg-indigo-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-4 mt-20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-md font-medium text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!profile) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3 mr-4">
              <FiUser className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name}</h1>
              <p className="text-indigo-100 text-xl">
                {profile.job_title || "Your Professional Title"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileCard
              icon={<FiMail className="text-indigo-500 text-xl" />}
              title="Contact Details"
              items={[
                { label: "Email Address", value: profile.email },
                {
                  label: "Current Location",
                  value: profile.location || "Not specified",
                },
              ]}
            />

            <ProfileCard
              icon={<FiBriefcase className="text-indigo-500 text-xl" />}
              title="Professional Information"
              items={[
                {
                  label: "Experience Level",
                  value: profile.career_level || "Not specified",
                },
                {
                  label: "Employment Type",
                  value: profile.work_type || "Not specified",
                },
                {
                  label: "Work Preference",
                  value: profile.remote_type || "Not specified",
                },
              ]}
            />

            <ProfileCard
              icon={<FiDollarSign className="text-indigo-500 text-xl" />}
              title="Salary & Benefits"
              items={[
                {
                  label: "Expected Salary",
                  value: profile.salary_expectation
                    ? `$${profile.salary_expectation.toLocaleString()}`
                    : "Not specified",
                },
                {
                  label: "Desired Benefits",
                  value: profile.benefits ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.benefits.split(",").map((benefit, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {benefit.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No benefits specified</span>
                  ),
                },
              ]}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProfileCard
              icon={<FiFileText className="text-indigo-500 text-xl" />}
              title="Career Documents"
              items={[
                {
                  label: "Resume File",
                  value: profile.resume_filename ? (
                    <a
                      href="#"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Download My Resume
                    </a>
                  ) : (
                    "Not uploaded yet"
                  ),
                },
              ]}
            />

            <ProfileCard
              icon={<FiCode className="text-indigo-500 text-xl" />}
              title="Technical Expertise"
              items={[
                {
                  label: "Professional Skills",
                  value: profile.skills ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "No skills listed"
                  ),
                },
              ]}
            />

            <ProfileCard
              icon={<FiCheckCircle className="text-indigo-500 text-xl" />}
              title="Account Information"
              items={[
                {
                  label: "Subscription Status",
                  value: (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile.payment_status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {profile.payment_status === "active"
                        ? "Active"
                        : "Pending"}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={() => navigate("/jobs")} // Add this line
            className="px-5 py-2 bg-indigo-600 rounded-lg text-md font-semibold text-white hover:bg-indigo-700"
          >
            See Jobs Related to My Skills
          </button>
        </div>
      </div>
    </main>
  );
}
