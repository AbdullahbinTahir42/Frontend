import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, profiles: 0 });
  const [profiles, setProfiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [verifyingProfiles, setVerifyingProfiles] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "", location: "", company: "", description: "",
    salary: "", type: "Full-time", experience: "Mid-level"
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes, 
          profilesRes, 
          jobsRes, 
          applicationsRes, 
          verifyingPaymentsRes
        ] = await Promise.all([
          axios.get(`${API_URL}/admin/stats`),
          axios.get(`${API_URL}/admin/profiles`),
          axios.get(`${API_URL}/admin/jobs`),
          axios.get(`${API_URL}/admin/applications`),
          axios.get(`${API_URL}/admin/payments/users`)
        ]);

        setStats(statsRes.data);
        setProfiles(profilesRes.data);
        setJobs(jobsRes.data);
        setApplications(applicationsRes.data);
        setVerifyingProfiles(verifyingPaymentsRes.data);
      } catch (err) {
        console.error(err);
        showNotification("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showNotification = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleMarkPayment = async (profileId) => {
    if (!window.confirm("Mark this payment as done?")) return;
    try {
      await axios.post(`${API_URL}/admin/payment/done`, { profile_id: profileId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProfiles((p) => p.map(u => u.id === profileId ? { ...u, payment_status: "Paid" } : u));
      showNotification("Payment marked done");
    } catch (err) {
      console.error(err);
      showNotification("Unable to mark payment", "error");
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/admin/jobs`, {
        ...newJob,
        salary: newJob.salary || null
      });
      setJobs([...jobs, res.data]);
      setShowJobForm(false);
      setNewJob({
        title: "", location: "", company: "", description: "",
        salary: "", type: "Full-time", experience: "Mid-level"
      });
      showNotification("Job added successfully");
    } catch (err) {
      console.error(err);
      showNotification("Failed to add job", "error");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`${API_URL}/admin/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
      showNotification("Job deleted");
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete job", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200">
        <div className="animate-spin h-12 w-12 border-4 border-[#ea9f6f] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200 p-6">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow z-50 ${
          notification.type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl font-bold mt-10 text-[#ea9f6f] mb-8">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <p className="text-gray-600 font-medium uppercase">{key}</p>
              <p className="text-3xl font-extrabold text-[#ea9f6f]">{val}</p>
            </div>
          ))}
        </div>

        {/* Verifying Payments Section */}
  {verifyingProfiles.length > 0 && (
  <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">
        Recent Payment Submissions ({verifyingProfiles.length})
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Users who recently submitted payment receipts
      </p>
    </div>
    <div className="divide-y divide-gray-200">
      {verifyingProfiles.map((profile) => (
        <div key={profile.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-gray-600 text-sm">
                  {profile.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{profile.full_name}</p>
                <p className="text-gray-600 text-sm">{profile.email}</p>
              </div>
            </div>
            <div>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                Plan: {profile.plan || "N/A"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


        {/* Applications */}
       <section className="bg-white rounded-lg shadow border mb-8">
  <div className="p-4 border-b">
    <h2 className="text-xl font-semibold text-gray-800">
      Applications ({applications.length})
    </h2>
  </div>
  <div className="divide-y divide-gray-200">
    {applications.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No applications found</p>
    ) : (
      applications.map(app => (
        <div key={app.id} className="p-4 hover:bg-gray-50 rounded">
          <div className="flex items-start space-x-4">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-gray-600 font-semibold uppercase">
                {app.full_name ? app.full_name.charAt(0) : app.user_email.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-gray-800">{app.full_name || "No name"}</p>
                  <p className="text-gray-600 text-sm">{app.user_email}</p>
                  <p className="text-gray-500 text-sm">Applied for: <span className="font-medium text-gray-700">{app.job_title}</span></p>
                </div>
                <span className={`text-xs px-2 py-1 rounded h-fit font-medium ${
                  app.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : app.status === "Submitted"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {app.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Applied on: {new Date(app.application_date).toLocaleDateString()}
              </p>

              {app.cover_letter && (
                <div className="mt-2">
                  <p className="text-gray-600 font-medium text-sm">Cover Letter:</p>
                  <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap line-clamp-4">
                    {app.cover_letter}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</section>


        {/* Profiles */}
        <section className="bg-white rounded-lg shadow border mb-8">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Profiles ({profiles.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {profiles.map(u => (
              <div key={u.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-gray-600">{u.full_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{u.full_name}</p>
                    <p className="text-gray-500 text-sm">{u.email}</p>
                  </div>
                </div>
                <div>
                  {u.payment_status === "Pending" && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs">
                      Receipt Pending
                    </div>
                  )}
                  {u.payment_status === "Verifying" && (
                    <button onClick={() => handleMarkPayment(u.id)}
                      className="bg-[#ea9f6f] text-white px-3 py-1 rounded text-xs hover:bg-orange-500">
                      Verify Payment
                    </button>
                  )}
                  {u.payment_status === "Paid" && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs">
                      Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs with Form */}
        <section className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Jobs ({jobs.length})
            </h2>
            <button onClick={() => setShowJobForm(!showJobForm)}
              className="bg-[#ea9f6f] text-white px-4 py-2 rounded hover:bg-orange-500 text-sm">
              {showJobForm ? "Cancel" : "Add Job"}
            </button>
          </div>

          {showJobForm && (
            <form onSubmit={handleAddJob} className="p-4 border-b space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["title","location","company"].map(field => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase()+field.slice(1)}*</label>
                    <input
                      required
                      placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-[#ea9f6f] focus:border-[#ea9f6f]"
                      value={newJob[field]}
                      onChange={e => setNewJob(prev => ({...prev, [field]: e.target.value}))}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Salary</label>
                  <input
                    placeholder="e.g. $80,000"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-[#ea9f6f] focus:border-[#ea9f6f]"
                    value={newJob.salary}
                    onChange={e => setNewJob(prev => ({...prev, salary: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus:ring-[#ea9f6f] focus:border-[#ea9f6f]"
                    value={newJob.type}
                    onChange={e => setNewJob(prev => ({...prev, type: e.target.value}))}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Experience</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded focus:ring-[#ea9f6f] focus:border-[#ea9f6f]"
                    value={newJob.experience}
                    onChange={e => setNewJob(prev => ({...prev, experience: e.target.value}))}
                  >
                    <option>Entry-level</option>
                    <option>Mid-level</option>
                    <option>Senior-level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows="4"
                  placeholder="Job Description"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-[#ea9f6f] focus:border-[#ea9f6f]"
                  value={newJob.description}
                  onChange={e => setNewJob(prev => ({...prev, description: e.target.value}))}
                />
              </div>

              <button type="submit"
                className="w-full bg-[#ea9f6f] text-white py-2 rounded hover:bg-orange-500">
                Add Job
              </button>
            </form>
          )}

          <div className="p-4 space-y-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No jobs available</p>
            ) : jobs.map(job => (
              <div key={job.id} className="border-b border-gray-200 pb-4 hover:bg-gray-50 p-2 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{job.title}</p>
                    <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                    {job.salary && <p className="text-gray-700 text-sm mt-1">{job.salary}</p>}
                    <div className="mt-1 flex space-x-2">
                      <span className="bg-yellow-100 text-[#ea9f6f] text-xs px-2 py-1 rounded">{job.type}</span>
                      <span className="bg-yellow-100 text-[#ea9f6f] text-xs px-2 py-1 rounded">{job.experience}</span>
                    </div>
                    {job.description && <p className="text-gray-600 text-sm mt-2">{job.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-500 hover:text-red-700 text-sm bg-red-50 px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}