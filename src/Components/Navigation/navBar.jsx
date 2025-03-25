import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../../assets/Icons/profile.svg';
import AccountDashboard from './accountDashboard/accountDash';
import './navigation.css';

export default function NavBar() {
    const navigate = useNavigate();
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
        navigate('/');
    };

    const handleResumeBuilderClick = () => {
        navigate('/resume-builder');
    };

    const handleResumeAnalyzerClick = () => {
        navigate('/resume-analyzer');
    };

    const handleCreditsClick = () => {
        navigate('/credits');
    }

    return (
        // Container for "Pill Nav Bar"
        <div className="nav-bar">
            <button className="buttonPage" onClick={handleHomeClick}>Home</button>
                
            <button className="buttonPage" onClick={handleResumeBuilderClick}>Resume Builder</button>
                
            <button className="buttonPage" onClick={handleResumeAnalyzerClick}>Resume Analyzer</button>
            
            <button className="buttonPage" onClick={handleCreditsClick}>Credits</button>
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