import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConnectUser from "../../Components/Forms/SignInUp/connectUser";
import logo from '../../assets/Resumaker.png';
import "./HomePage.css";

export default function HomePage() {
  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleLoginClick = () => {
    alert("REMEMBER TO DIRECT GET STARTED TO LOGIN PAGE");
    setShowModal(true);
  };

  return (
    <>
      <div className="homepage-container">
        <div className="homepage-content">
          {/* Logo Image */}
          <img src={logo} alt="ResuMaker Logo" className="home-logo" /*style="width: 500px; height: auto; margin-top: 10vh;"*/ />

          {/* About Section */}
          <div className="about-section">
            <h1 className="about-title">Welcome to ResuMaker</h1>
            <p className="about-text">
              ResuMaker utilizes AI to help you create professional resumes, analyze existing resumes, and prepare for interviews with an AI-powered tool.
            </p>
          </div>

          {/* Buttons */}
          <div className="button-container">
            
            <button className="button get-started" onClick={() => navigate("/resume-builder")}>Get Started</button>
            <div className="login-section">
              <span className="login-text">Already a user? </span>
              <button className="button login-button" onClick={handleLoginClick}>Login</button>
            </div>
          </div>
        </div>
        
      </div>
      <ConnectUser isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}