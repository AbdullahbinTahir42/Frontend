// ✅ Updated AdminPanel using Profile objects instead of Users

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    profiles: 0,
  });
  const [profiles, setProfiles] = useState([]); // Renamed from users
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    company: "",
    description: "",
    salary: "",
    type: "Full-time",
    experience: "Mid-level",
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profilesRes, jobsRes, applicationsRes] =
          await Promise.all([
            axios.get(`${API_URL}/admin/stats`),
            axios.get(`${API_URL}/admin/profiles`),
            axios.get(`${API_URL}/admin/jobs`),
            axios.get(`${API_URL}/admin/applications`),
          ]);

        setStats(statsRes.data);
        setProfiles(profilesRes.data);
        setJobs(jobsRes.data);
        setApplications(applicationsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkPayment = async (profileId) => {
    if (!window.confirm("Are you sure you want to mark this payment as done?"))
      return;

    try {
      await axios.post(
        `${API_URL}/admin/payment/done`,
        { profile_id: profileId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, payment_status: "Paid" } : p
        )
      );

      showNotification("Payment marked as completed!");
    } catch (error) {
      console.error("Error marking payment:", error);
      showNotification(
        "Failed to mark payment: " +
          (error.response?.data?.detail || "Unknown error"),
        "error"
      );
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...newJob,
        salary: newJob.salary || null,

      };
      const response = await axios.post(`${API_URL}/admin/jobs`, jobData);
      setJobs([...jobs, response.data]);
      setNewJob({
        title: "",
        location: "",
        company: "",
        description: "",
        salary: "",
        type: "Full-time",
        experience: "Mid-level",
      });
      setShowJobForm(false);
      showNotification("Job added successfully!");
    } catch (error) {
      console.error("Error adding job:", error);
      const errorMsg = error.response?.data?.detail;
      if (Array.isArray(errorMsg)) {
        const messages = errorMsg
          .map((err) => `${err.loc[1]}: ${err.msg}`)
          .join("\n");
        showNotification(messages, "error");
      } else {
        showNotification("Failed to add job", "error");
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`${API_URL}/admin/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job.id !== jobId));
      showNotification("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      showNotification("Failed to delete job", "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            notification.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: "users", label: "USERS", value: stats.users },
            { key: "jobs", label: "JOBS", value: stats.jobs },
            {
              key: "applications",
              label: "APPLICATIONS",
              value: stats.applications,
            },
            { key: "profiles", label: "PROFILES", value: stats.profiles },
          ].map((stat) => (
            <div
              key={stat.key}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Applications ({applications.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {applications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No applications found
              </p>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm">
                        {application.user_email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
                        <p className="font-medium text-gray-800 truncate">
                          {application.full_name ||
                            application.user_email.split("@")[0]}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {application.user_email.toLowerCase()}
                        </p>
                      </div>

                      <p className="mt-1 text-gray-700">
                        Applied for{" "}
                        <span className="font-medium">
                          {application.job_title}
                        </span>
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            application.status === "Submitted"
                              ? "bg-blue-100 text-blue-800"
                              : application.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {application.status}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(
                            application.application_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {application.cover_letter && (
                    <div className="mt-3 pl-14">
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Cover Letter:
                      </p>
                      <p className="text-gray-500 text-sm whitespace-pre-line">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profiles */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Profiles ({profiles.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <div key={profile.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {profile.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {profile.full_name}
                      </p>
                      <p className="text-gray-600 text-sm">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {profile.payment_status === "Pending" && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
                     
                         >
                        Receipt Pending
                      </div>
                    )}

                    {profile.payment_status === "Verifying" && (
                      <>
                        <button
                          onClick={() => handleMarkPayment(profile.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Verify Payment
                        </button>
                       
                      </>
                    )}

                    {profile.payment_status === "Paid" && (
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-xs cursor-not-allowed">
                        Payment Verified
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs section */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Jobs ({jobs.length})
            </h2>
            <button
              onClick={() => setShowJobForm(!showJobForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {showJobForm ? "Cancel" : "Add Job"}
            </button>
          </div>

          {/* Add Job Form */}
          {showJobForm && (
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleAddJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title*
                    </label>
                    <input
                      type="text"
                      placeholder="Job Title"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={newJob.title}
                      onChange={(e) =>
                        setNewJob({ ...newJob, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location*
                    </label>
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={newJob.location}
                      onChange={(e) =>
                        setNewJob({ ...newJob, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company*
                    </label>
                    <input
                      type="text"
                      placeholder="Company"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={newJob.company}
                      onChange={(e) =>
                        setNewJob({ ...newJob, company: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $80,000 - $100,000"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={newJob.salary}
                      onChange={(e) =>
                        setNewJob({ ...newJob, salary: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={newJob.type}
                      onChange={(e) =>
                        setNewJob({ ...newJob, type: e.target.value })
                      }
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      value={newJob.experience}
                      onChange={(e) =>
                        setNewJob({ ...newJob, experience: e.target.value })
                      }
                    >
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior-level">Senior-level</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Job Description"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob({ ...newJob, description: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Add Job
                </button>
              </form>
            </div>
          )}

          {/* Jobs List */}
          <div className="p-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No jobs available
              </p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="mb-4 last:mb-0 border-b border-gray-200 pb-4 last:border-b-0 hover:bg-gray-50 p-2 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800">{job.title}</p>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-500 hover:text-red-700 text-sm bg-red-50 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {job.company} • {job.location}
                      </p>
                      {job.salary && (
                        <p className="text-green-600 text-sm mt-1">
                          {job.salary}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {job.type}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {job.experience}
                        </span>
                      </div>
                      {job.description && (
                        <p className="text-gray-500 text-sm mt-2">
                          {job.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
