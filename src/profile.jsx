import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiFileText,
  FiBriefcase,
  FiCode,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";

function ProfileCard({ icon, title, items }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow hover:shadow-md transition-shadow">
      <div className="flex items-center mb-5 pb-2 border-b border-yellow-200">
        <div className="bg-yellow-100 p-2 rounded-lg mr-3 text-[#ea9f6f]">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-[#ea9f6f] tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
              {item.label}
            </p>
            <p className="text-base sm:text-lg text-gray-800 font-semibold mt-1 break-words">
              {item.value}
            </p>
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
    fetch("https://localhost:8000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile details");
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
          <div className="w-16 h-16 bg-yellow-300 rounded-full mb-4"></div>
          <div className="h-4 bg-yellow-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-yellow-300 rounded w-1/2"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-4 mt-20">
        <p className="text-md font-medium text-red-700">{error}</p>
      </div>
    );

  if (!profile) return null;

  return (
    <div className="min-h-screen mt-6 overflow-x-hidden px-4 py-6 sm:px-6">
      <main className="max-w-4xl  mx-auto bg-gradient-to-b from-white via-yellow-100 to-yellow-200 rounded-[20px] shadow-lg">
        <div className="bg-white rounded-xl  shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ea9f6f]  to-yellow-400 p-6 text-white rounded-t-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white/30 backdrop-blur-md rounded-full p-3">
                <FiUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold break-words">
                  {profile.full_name}
                </h1>
                <p className="text-white/90 text-lg sm:text-xl break-words">
                  {(profile.job_title || "Your Professional Title")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
            <div className="space-y-6">
              <ProfileCard
                icon={<FiMail className="text-[#ea9f6f] text-xl" />}
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
                icon={<FiBriefcase className="text-[#ea9f6f] text-xl" />}
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
                icon={<FiDollarSign className="text-[#ea9f6f] text-xl" />}
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
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-[#ea9f6f]"
                          >
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

            <div className="space-y-6">
              <ProfileCard
                icon={<FiFileText className="text-[#ea9f6f] text-xl" />}
                title="Career Documents"
                items={[
                  {
                    label: "Resume File",
                    value: profile.resume_filename ? (
                      <a
                        href={`http://api.hr.growvy.online/resumes/${profile.resume_filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ea9f6f] hover:underline font-medium"
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
                icon={<FiCode className="text-[#ea9f6f] text-xl" />}
                title="Technical Expertise"
                items={[
                  {
                    label: "Professional Skills",
                    value: profile.skills ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="bg-yellow-100 text-[#ea9f6f] text-sm font-medium px-3 py-1 rounded-full"
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
                icon={<FiCheckCircle className="text-[#ea9f6f] text-xl" />}
                title="Account Information"
                items={[
                  {
                    label: "Subscription Status",
                    value: (() => {
                      const status = profile.payment_status?.toLowerCase();

                      if (status === "paid") {
                        return (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        );
                      }

                      if (status === "verifying") {
                        return (
                          <div className="flex flex-col gap-1">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              Verifying
                            </span>
                            <p className="text-sm text-gray-600">
                              You can explore jobs after admin approval.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                      );
                    })(),
                  },
                ]}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 sm:p-6 text-center">
            {profile.payment_status?.toLowerCase() === "paid" ? (
              <button
                onClick={() => navigate("/jobs")}
                className="px-5 py-2 bg-[#ea9f6f] rounded-lg text-md font-semibold text-white hover:bg-orange-400 transition"
              >
                See Jobs Related to My Skills
              </button>
            ) : (
              <p className="text-red-600 font-semibold text-md">
                {profile.payment_status?.toLowerCase() === "verifying"
                  ? "Your payment is under verification. You can access jobs after admin approval."
                  : "Clear your payment to access jobs"}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
