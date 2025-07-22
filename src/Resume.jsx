import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from './Footer';

export default function ResumeUpload() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Fixed: removed mockNavigate
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => fileInputRef.current.click();

  const validateFile = (file) => {
    if (!file) return "No file selected";
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (10MB)`;
    }
    
    if (file.size === 0) {
      return "File appears to be empty";
    }
    
    // Check file type
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.html', '.rtf', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return `Unsupported file type. Allowed types: ${allowedExtensions.join(', ')}`;
    }
    
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");
    setMessage("");
    
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setMessage(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }
  };

  const getErrorMessage = (error, response) => {
    // Handle network errors
    if (!navigator.onLine) {
      return "No internet connection. Please check your connection and try again.";
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return "Unable to connect to server. Please check your internet connection and try again.";
    }
    
    // Handle timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return "Request timed out. The file might be too large or the server is busy. Please try again.";
    }
    
    // Handle authentication errors
    if (response?.status === 401 || error.message.includes('401') || error.message.includes('Unauthorized')) {
      return "Your session has expired. Please log in again.";
    }
    
    // Handle specific HTTP status codes
    if (response?.status === 413) {
      return "File is too large. Please try a smaller file.";
    }
    
    if (response?.status === 415) {
      return "Unsupported file type. Please upload a PDF, DOC, DOCX, HTML, RTF, or TXT file.";
    }
    
    if (response?.status === 429) {
      return "Service is temporarily busy. Please try again in a few minutes.";
    }
    
    if (response?.status === 500) {
      return "Server error occurred. Please try again later.";
    }
    
    if (response?.status === 502 || response?.status === 503) {
      return "Service is temporarily unavailable. Please try again later.";
    }
    
    // Return the actual error message if it's user-friendly
    if (error.message && error.message.length < 200 && !error.message.includes('fetch')) {
      return error.message;
    }
    
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async () => {
    // Clear previous messages
    setError("");
    setMessage("");

    // Validate file selection
    if (!selectedFile) {
      setError("Please select a resume file first.");
      return;
    }

    // Validate file again before submission
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000); // 60 second timeout

    try {
      // Check authentication
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("resume", selectedFile);

      // Debug: log all form data pairs
      console.log("FormData content:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - name=${value.name}, size=${value.size}, type=${value.type}`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Make the request
      const response = await fetch("https://api.hr.growvy.online/resume/analyze", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear timeout if request completes

      console.log("Response status:", response.status);

      // Handle response
      if (!response.ok) {
        let errorData = null;
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.log("Error response data:", errorData);
            
            // Extract error message from various possible formats
            if (errorData.detail) {
              if (typeof errorData.detail === 'string') {
                errorMessage = errorData.detail;
              } else if (Array.isArray(errorData.detail)) {
                // Handle FastAPI validation errors
                errorMessage = errorData.detail.map(err => 
                  `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`
                ).join(', ');
              } else if (typeof errorData.detail === 'object') {
                errorMessage = JSON.stringify(errorData.detail);
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          } else {
            // Try to get response as text
            const errorText = await response.text();
            if (errorText && errorText.length < 500) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.log("Could not parse error response:", parseError);
        }
        
        const error = new Error(errorMessage);
        error.response = response;
        throw error;
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
        console.log("Success response:", data);
      } catch (parseError) {
        throw new Error("Server returned an invalid response format.");
      }

      // Validate response data
      if (!data || !data.analysis) {
        throw new Error("Invalid response from server. Analysis data is missing.");
      }
      
      // Store analysis and redirect
      try {
        localStorage.setItem("resume_analysis", JSON.stringify(data.analysis));
      } catch (storageError) {
        console.warn("Could not save analysis to localStorage:", storageError);
        // Don't fail the entire flow for localStorage issues
      }
      
      setMessage("Resume analyzed successfully! Redirecting to remote jobs...");
      
      // Navigate to /remote-jobs after analysis is complete
      setTimeout(() => {
        navigate("/remote-jobs");
      }, 1500);

    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout
      console.error("Resume submission error:", error);
      
      const errorMessage = getErrorMessage(error, error.response);
      setError(errorMessage);

      // Handle authentication errors
      if (error.response?.status === 401 || 
          error.message.includes("401") || 
          error.message.includes("authentication") ||
          error.message.includes("Unauthorized")) {
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTooltipClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-yellow-100 to-yellow-200 px-4 pt-16">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center text-[#ea9f6f]">
        Want better job matches? Upload your resume.
      </h1>

      <div className="relative mb-6 flex justify-center">
        {showTooltip && (
          <div className="absolute bottom-6 w-72 bg-yellow-100 border border-yellow-300 rounded shadow-lg px-4 py-2 text-sm text-yellow-900 z-10">
            Uploading your resume helps us match you faster. You can still
            update answers later.
            <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-yellow-100 rotate-45 border-b border-r border-yellow-300" />
          </div>
        )}
        <button
          onClick={handleTooltipClick}
          className="text-[#ea9f6f] hover:text-orange-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </button>
      </div>

      <div
        onClick={handleUploadClick}
        className="cursor-pointer bg-white border border-yellow-300 rounded-md p-8 flex flex-col items-center justify-center mb-4 hover:scale-105 transition shadow-lg"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.html,.rtf,.txt"
        />
        <div className="mb-4">
          <div className="w-16 h-16 bg-[#ea9f6f] rounded-full flex items-center justify-center transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4"
              />
            </svg>
          </div>
        </div>
        <p className="text-lg font-medium text-[#ea9f6f] mb-1">
          Upload a Resume
        </p>
        <p className="text-sm text-gray-600 text-center">
          We'll fill in your answers automatically.
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          Supported formats: PDF, DOC, DOCX, HTML, RTF, TXT (Max 10MB)
        </p>
        <span className="mt-3 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-orange-300 to-orange-500 text-white font-medium transition hover:brightness-110">
          Resume Review Included
        </span>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[#ea9f6f] text-white px-6 py-2 rounded hover:bg-orange-500 transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !selectedFile}
      >
        {loading ? "Analyzing..." : "Submit Resume"}
      </button>

      {/* Success message */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-center">
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-center max-w-md">
          {error}
        </div>
      )}

      <p
        onClick={() => navigate("/remote-jobs")}
        className="text-[#ea9f6f] font-bold cursor-pointer hover:underline"
      >
        Skip for Now
      </p>  

      <Footer />
    </div>
  );
}