import { useState } from 'react';
import './connectUser.css';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

export default function ConnectUser({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="connect-user-container">
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        {/* Spacing equivalent to SizedBox */}
        <div className="spacer"></div>
        
        {/* Custom Tab Bar */}
        <div className="tab-bar">
          {/* Animated Selection Indicator */}
          <div 
            className="tab-indicator"
            style={{ 
              left: `${activeTab * 50}%`, 
              width: '50%' 
            }}
          ></div>
          
          {/* Tab Buttons */}
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              Login
            </button>
            <button 
              className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              Register
            </button>
          </div>
        </div>
        
        {/* Form Content Area */}
        <div className="form-content">
          {activeTab === 0 ? (
            <LoginForm />
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </div>
  );
}