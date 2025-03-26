import React, { useEffect, useState } from 'react';
import './accountDash.css';
import './savedResumes.css';

export default function AccountDashboard() {
    const [showSavedResumes, setShowSavedResumes] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSavedResumes = () => {
        setShowSavedResumes(true);
    };

    const toggleSavedResumes = (value) => {
        setShowSavedResumes(value);
    };

    const handleLogout = () => {
        //Logout logic here
    };
    
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
    
    // Updated view handler: fetch the resume PDF blob using resumeId, then open it in a new tab.
    const handleViewResume = async (resumeId) => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) throw new Error("User email not found");
            const API_URL = 'https://resumaker-api.onrender.com';
            const response = await fetch(`${API_URL}/user/${userEmail}/resumes/${resumeId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch resume");
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error viewing resume:", error);
        }
    };

    return(
        <div className="dropDownContent">
            <button onClick={handleSavedResumes}>My Saved Resumes</button>    
            <button id='logout' onClick={handleLogout}>Logout</button>
            
            {showSavedResumes && (
                <SavedResumeModal 
                    onClose={() => toggleSavedResumes(false)} 
                    resumes={resumes}
                    isLoading={isLoading}
                    error={error}
                    handleViewResume={handleViewResume}
                />
            )}
        </div>
    );
}

function SavedResumeModal({ onClose, resumes, isLoading, error, handleViewResume }) {
    return(
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="savedResumes" onClick={(e) => e.stopPropagation()}>
                <button className="close" onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}>X</button>
                <p id="title">Saved Resumes</p>
                
                <div className="resumeList">
                    {isLoading && <p>Loading...</p>}
                    {error && <p className="error">{error}</p>}
                    {resumes && resumes.length > 0 ? (
                        resumes.map((resume) => (
                            <ResumeCard 
                                key={resume._id} 
                                resume={resume}
                                onView={handleViewResume}
                            />
                        ))
                    ) : (
                        !isLoading && <p>No resumes found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

function ResumeCard({ resume, onView }) {
    return(
        <div className="resumeCard">
            <h2>{resume.name || "Untitled Resume"}</h2>
            <p>Created on: {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : "Unknown"}</p>
            <button onClick={() => onView(resume._id)}>View</button>
        </div>
    );
}