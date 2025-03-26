import { useEffect, useRef, useState } from 'react';
import '../../../index.css';
import './connectUser.css';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

export default function ConnectUser({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  
  // Add refs for the tab buttons and indicator, similar to NavPill
  const buttonRefs = [useRef(null), useRef(null)];
  const sliderRef = useRef(null);
  
  // Update slider position when active tab changes - identical to NavPill implementation
  useEffect(() => {
    if (!isOpen) return; // Only run when modal is open
    
    if (!sliderRef.current || !buttonRefs[activeTab].current) return;
    
    const activeButton = buttonRefs[activeTab].current;
    const container = activeButton.parentElement;
    
    // Calculate the left position relative to the container
    const leftPosition = activeButton.offsetLeft;
    
    // Set the width of the slider to match the button's width
    sliderRef.current.style.width = `${activeButton.offsetWidth}px`;
    sliderRef.current.style.left = `${leftPosition}px`;
  }, [activeTab, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      
      <div className="connect-user-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="spacer"></div>
        
        {/* Restructured tab bar to match NavPill */}
        <div className="tab-bar">
          {/* Slider element instead of indicator */}
          <div className="slider" ref={sliderRef}></div>
          
          {/* Direct buttons as children of tab-bar, like in NavPill */}
          <button 
            ref={buttonRefs[0]}
            className={activeTab === 0 ? 'active' : ''}
            onClick={() => setActiveTab(0)}
          >
            Login
          </button>
          
          <button 
            ref={buttonRefs[1]}
            className={activeTab === 1 ? 'active' : ''}
            onClick={() => setActiveTab(1)}
          >
            Register
          </button>
        </div>
        
        <div className="form-content">
          {activeTab === 0 ? (
            <LoginForm />
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </>
  );
}