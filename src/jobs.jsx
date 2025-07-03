import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mode: '',
    location: '',
    experience: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/jobs/');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMode = filters.mode ? job.mode === filters.mode : true;
    const matchesLocation = filters.location ? job.location.includes(filters.location) : true;
    const matchesExperience = filters.experience ? job.experience === filters.experience : true;

    return matchesSearch && matchesMode && matchesLocation && matchesExperience;
  });

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-8">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Browse through our latest job openings
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-blue-500"
                onClick={() => handleJobClick(job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {job.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                      <p className="text-gray-600">{job.mode} • {job.location}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.experience && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.experience}
                          </span>
                        )}
                        {job.salary && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            ${job.salary.toLocaleString()}/yr
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="text-sm text-gray-500">
                      {job.posted_at ? `Posted ${new Date(job.posted_at).toLocaleDateString()}` : "New"}
                    </span>
                    <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 hidden md:inline-block">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
