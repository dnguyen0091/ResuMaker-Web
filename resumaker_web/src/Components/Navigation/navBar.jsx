import React, { useEffect, useRef, useState } from 'react';
import profile from '../../assets/Icons/profile.svg';
import AccountDashboard from './accountDashboard/accountDash';
import './navigation.css';

export default function NavBar() {
    // State to control dropdown visibility
    const [showDropdown, setShowDropdown] = useState(false);
    // Reference to the dropdown container for click outside detection
    const dropdownRef = useRef(null);

    // Handle profile click to toggle dropdown
    const handleProfileClick = () => {
        setShowDropdown(prevState => !prevState);
    };

    // Handle clicking outside of the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Add event listener when dropdown is shown
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleHomeClick = () => {
        // Redirect to home page
        window.location.href = '/';
    };

    const handleResumeBuilderClick = () => {
        // Redirect to resume builder page
        window.location.href = '/resume-builder';
    };

    const handleResumeAnalyzerClick = () => {
        // Redirect to resume analyzer page
        window.location.href = '/resume-analyzer';
    };

    return (
        // Container for "Pill Nav Bar"
        <div className="nav-bar">
            <button className="buttonPage" onClick={handleHomeClick}>Home</button>
                
            <button className="buttonPage" onClick={handleResumeBuilderClick}>Resume Builder</button>
                
            <button className="buttonPage" onClick={handleResumeAnalyzerClick}>Resume Analyzer</button>
            
            <div className="profile-container" ref={dropdownRef}>
                <button 
                    className="profile-button" 
                    onClick={handleProfileClick}
                >
                    <img src={profile} alt="Profile" />
                </button>
                
                {/* Dropdown menu */}
                {showDropdown && (
                    <div className="profile-dropdown">
                        <AccountDashboard />
                    </div>
                )}
            </div>
        </div>
    );
}