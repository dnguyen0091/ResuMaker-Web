import { useEffect, useRef, useState } from 'react';
import './navigation.css';

export default function NavPill() {
    // State to track active tab (0: Resume Builder, 1: Resume Analyzer, 2: Interview Tool)
    const [activeTab, setActiveTab] = useState(0);
    
    // Refs for buttons to measure their positions
    const buttonRefs = [useRef(null), useRef(null), useRef(null)];
    const sliderRef = useRef(null);
    
    // Update slider position when active tab changes
    useEffect(() => {
        if (!sliderRef.current || !buttonRefs[activeTab].current) return;
        
        const activeButton = buttonRefs[activeTab].current;
        const container = activeButton.parentElement;
        
        // Calculate the left position relative to the container
        const leftPosition = activeButton.offsetLeft;
        
        // Set the width of the slider to match the button's width
        sliderRef.current.style.width = `${activeButton.offsetWidth}px`;
        sliderRef.current.style.left = `${leftPosition}px`;
    }, [activeTab]);

    function handleResumeBuilderClick() {
        setActiveTab(0);
        // Redirect to resume builder page
        // window.location.href = '/resume-builder';
    }
    
    function handleResumeAnalyzerClick() {
        setActiveTab(1);
        // Redirect to resume analyzer page
        // window.location.href = '/resume-analyzer';
    }
    
    function handleInterviewToolClick() {
        setActiveTab(2);
        // Redirect to interview tool page
        // window.location.href = '/interview-tool';
    }

    return (
        <div className="navPillContainer">
            <div className="slider" ref={sliderRef}></div>
            <button 
                ref={buttonRefs[0]} 
                onClick={handleResumeBuilderClick} 
                className={activeTab === 0 ? 'active' : ''}
            >
                <img src="" alt="Resume Builder" />
            </button>
                
            <button 
                ref={buttonRefs[1]} 
                onClick={handleResumeAnalyzerClick}
                className={activeTab === 1 ? 'active' : ''}
            >
                <img src="" alt="Resume Analyzer" />
            </button>
                
            <button 
                ref={buttonRefs[2]} 
                onClick={handleInterviewToolClick}
                className={activeTab === 2 ? 'active' : ''}
            >
                <img src="" alt="Interview Tool" />
            </button>
        </div>
    );
}