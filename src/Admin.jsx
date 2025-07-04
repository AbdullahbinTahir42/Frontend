import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [view, setView] = useState("dashboard");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, profiles: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({ title: "", location: "", mode: "" });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, jobsRes, appsRes, profilesRes] = await Promise.all([
        axios.get("/admin/stats", { headers }),
        axios.get("/admin/users", { headers }),
        axios.get("/admin/jobs", { headers }),
        axios.get("/admin/applications", { headers }),
        axios.get("/admin/profiles", { headers }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      setProfiles(
        Array.isArray(profilesRes.data) ? profilesRes.data : profilesRes.data.profiles || []
      );
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJobDelete = async (id) => {
    try {
      await axios.delete(`/admin/jobs/${id}`, { headers });
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.location || !newJob.mode) return;
    try {
      const res = await axios.post("/admin/jobs", newJob, { headers });
      setJobs((prev) => [...prev, res.data]);
      setNewJob({ title: "", location: "", mode: "" });
    } catch (err) {
      console.error("Error adding job", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-indigo-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          {["dashboard", "users", "jobs", "applications", "profiles"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-left px-4 py-2 rounded ${
                view === v ? "bg-indigo-600 text-white" : "hover:bg-indigo-700"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {view === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white shadow rounded-xl p-5 text-center border"
              >
                <h4 className="font-bold text-gray-700 text-sm uppercase">{key}</h4>
                <p className="text-3xl text-indigo-700 font-bold mt-2">{value}</p>
              </div>
            ))}
          </div>
        )}

        {view === "jobs" && (
          <div className="bg-white p-4 rounded-xl shadow border mt-4">
            <h2 className="text-lg font-semibold mb-4">Jobs</h2>

            {/* Add Job Form */}
            <form onSubmit={handleAddJob} className="mb-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  className="p-2 border rounded"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="p-2 border rounded"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Mode (Remote, Hybrid, etc.)"
                  className="p-2 border rounded"
                  value={newJob.mode}
                  onChange={(e) => setNewJob({ ...newJob, mode: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Add Job
              </button>
            </form>

            {/* Job List */}
            <ul className="space-y-3">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="border p-3 rounded bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-md">{job.title}</h3>
                    <p className="text-sm text-gray-600">
                      {job.mode} | {job.location}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJobDelete(job.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Keep other views (users, applications, profiles) same as before... */}
      </main>
    </div>
  );
}
