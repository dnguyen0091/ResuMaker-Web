import { useState } from 'react';
import './accountDash.css';
import './savedResumes.css';

export default function AccountDashboard() 
{
    const [showSavedResumes, setShowSavedResumes] = useState(false);

    const handleSavedResumes = () => {
        setShowSavedResumes(true);
    };

    const toggleSavedResumes = (value) => {
        setShowSavedResumes(value);
    };

    const handleLogout = () => {
        //Logout
    }
    
    return(
        <div className="dropDownContent">
            <button onClick={handleSavedResumes}>My Saved Resumes</button>    
            <button id='logout' onClick={handleLogout}>Logout</button>
            
            {showSavedResumes && (
                <SavedResumeModal onClose={() => toggleSavedResumes(false)} />
            )}
        </div>
    )
}

// Created a differently named component to avoid any conflicts
function SavedResumeModal({ onClose }) {
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
                    {/* FOR TESTING */}
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>


                </div>
            </div>
        </>
    )
}

function ResumeCard() {
    return(
        <div className="resumeCard">
            <h2>Resume Name</h2>
            <p>Created on: 01/01/2021</p>
            <button>View</button>
        </div>
    )
}

function RetrieveResumes() {
    //Retrieve resumes from database
    //Return array of resume objects
}