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
            // Get user email from localStorage
            console.log("Fetching resume with ID:", resumeId);
            const user = JSON.parse(localStorage.getItem('user'));
            const userEmail = user?.email || localStorage.getItem('userEmail');
            
            if (!userEmail) throw new Error("User email not found");
            
            const API_URL = 'https://resumaker-api.onrender.com';
            
            // Updated endpoint to match your server's route structure
            const response = await fetch(`${API_URL}/api/resume/view/${resumeId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch resume");
            }
            
            // Process the JSON response
            const resumeData = await response.json();
            console.log("Resume data:", resumeData);
            
            // Check if filePath exists in the response
            if (!resumeData.filePath) {
                throw new Error("Resume file path not found");
            }
            
            // Construct the full URL to the PDF file
            const token = localStorage.getItem('token');
            // Include the token as a query parameter for authentication
            const pdfUrl = `${API_URL}${resumeData.filePath}?token=${token}`;
            console.log("Opening PDF URL:", pdfUrl);
            
            // Open the PDF in a new tab
            window.open(pdfUrl, '_blank');
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
            <h2>{resume.fileName || "Untitled Resume"}</h2>
            <p>Created: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : "Unknown"}</p>
            <button onClick={() => onView(resume._id)}>View</button>
        </div>
    );
    }