import React, { useEffect, useState } from 'react';
import './savedResumes.css';

export default function SavedResumes({ closePopup }) {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the user's resumes from the API
  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error("User email not found");
      }
      
      const API_URL = 'https://resumaker-api.onrender.com';
      const response = await fetch(`${API_URL}/user/${userEmail}/resumes`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }
      
      const resumesData = await response.json();
      setResumes(resumesData);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    console.log("Close button clicked in SavedResumes");
    closePopup();
  };

  return (
    <>
      <div className="overlay" onClick={closePopup}></div>
      <div className="savedResumes" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={handleClose}>X</button>
        <p id="title">Saved Resumes</p>
        
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        
        <div className="resumeList">
          {resumes.length > 0 ? (
            resumes.map((resume, idx) => (
              <ResumeCard key={idx} resume={resume} />
            ))
          ) : (
            !isLoading && <p>No resumes found.</p>
          )}
        </div>
      </div>
    </>
  );
}

function ResumeCard({ resume }) {
  return (
    <div className="resumeCard">
      <h2>{resume.name || "Untitled Resume"}</h2>
      <p>Created on: {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : "Unknown"}</p>
      <button>View</button>
    </div>
  );
}