import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './accountDash.css';
import './savedResumes.css';

export default function AccountDashboard() {
    const [showSavedResumes, setShowSavedResumes] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSavedResumes = () => {
        setShowSavedResumes(true);
    };

    const toggleSavedResumes = (value) => {
        setShowSavedResumes(value);
    };

    const handleLogout = () => {
        //Logout logic here
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };
    



    const fetchResumes = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // First try to get email from user object
            let userEmail = null;
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (user && user.email) {
                userEmail = user.email;
            } else {
                // Fallback to direct userEmail if available
                userEmail = localStorage.getItem('userEmail');
            }
            
            if (!userEmail) {
                throw new Error("User email not found");
            }
            
            const API_URL = 'https://resumaker-api.onrender.com';
            const response = await fetch(`${API_URL}/api/resume/${userEmail}/resumes`, {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch resumes");
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
    
    const handleViewResume = async (resumeId) => {
        try {
            // Get user from localStorage
            console.log("Fetching resume with ID:", resumeId);
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user || !user._id) throw new Error("User not found. Please log in again.");
            
            const API_URL = 'https://resumaker-api.onrender.com';
            
            console.log(`Requesting: ${API_URL}/api/resume/view/${user._id}/${resumeId}`);
            
            // Find the resume object to get the filename
            const resumeObj = resumes.find(r => r._id === resumeId);
            const fileName = resumeObj?.fileName || `resume_${resumeId}.pdf`;
            
            // Updated endpoint path to match the new structure that takes userId and resumeId
            const response = await fetch(`${API_URL}/api/resume/view/${user._id}/${resumeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch resume");
                } else {
                    const errorText = await response.text();
                    throw new Error(`Server error: ${response.status}. ${errorText || ''}`);
                }
            }
            
            // Convert response to blob
            const blob = await response.blob();
            
            if (blob.size === 0) {
                throw new Error("Received empty file from server");
            }
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
        } catch (error) {
            console.error("Error downloading resume:", error);
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
    // Sort resumes by uploadedAt date, most recent first
    const sortedResumes = [...resumes].sort((a, b) => {
        // If either doesn't have uploadedAt, fall back to _id comparison
        if (!a.uploadedAt || !b.uploadedAt) {
            return b._id?.localeCompare(a._id) || 0;
        }
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });
    
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
                        sortedResumes.map((resume) => (
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
            <h2 title={resume.fileName || "Untitled Resume"}>
                {resume.fileName || "Untitled Resume"}
            </h2>
            <p>Created: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : "Unknown"}</p>
            <button onClick={() => onView(resume._id)}>View</button>
        </div>
    );
}