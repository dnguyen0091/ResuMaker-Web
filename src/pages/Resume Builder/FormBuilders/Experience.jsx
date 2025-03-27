import React, { useEffect, useState } from 'react';
import starIcon from '../../../assets/Icons/stars.svg';

export default function Experience({ experienceList, setExperienceList }) {
    const [reviewingId, setReviewingId] = useState(null);

    // AI review function for experience
    const reviewAI = async (experienceId) => {
        // Set the reviewing state to show loading indicator
        setReviewingId(experienceId);
        
        const experience = experienceList.find(item => item.id === experienceId);
        
        try {
            const API_URL = 'https://resumaker-api.onrender.com';
            const response = await fetch(`${API_URL}/api/ai/generate-experience-bullets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(experience)
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            // Parse the response to get the generated bullets
            const data = await response.json();
            
            // Update the entry with the generated bullet points
            if (data.bullets && Array.isArray(data.bullets)) {
                setExperienceList(
                    experienceList.map(item => {
                        if (item.id === experienceId) {
                            // Create a copy of the current bullet points
                            const updatedBulletPoints = [...(item.bulletPoints || ['', '', ''])];
                            
                            // Update with AI-generated content (up to 3 bullets)
                            updatedBulletPoints[0] = data.bullets[0] || updatedBulletPoints[0];
                            updatedBulletPoints[1] = data.bullets[1] || updatedBulletPoints[1];
                            updatedBulletPoints[2] = data.bullets[2] || updatedBulletPoints[2];
                            
                            return { ...item, bulletPoints: updatedBulletPoints };
                        }
                        return item;
                    })
                );
            }
            
        } catch (error) {
            console.error('Error generating AI content:', error);
            // Optionally show an error message to the user
        } finally {
            // Clear the reviewing state
            setReviewingId(null);
        }
    };
    
    // Add a new experience entry
    const addExperience = () => {
        const newId = experienceList.length > 0 
            ? Math.max(...experienceList.map(item => item.id)) + 1 
            : 1;
            
        setExperienceList([
            ...experienceList,
            {
                id: newId,
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrentPosition: false,
                bulletPoints: ['', '', ''] // Using bullet points instead of description
            }
        ]);
    };

    // Remove an experience entry
    const removeExperience = (id) => {
        if (experienceList.length <= 1) return;
        setExperienceList(experienceList.filter(item => item.id !== id));
    };

    // Update an experience entry
    const updateExperience = (id, field, value) => {
        setExperienceList(
            experienceList.map(item => {
                if (item.id === id) {
                    // Special handling for current position checkbox
                    if (field === 'isCurrentPosition') {
                        return { 
                            ...item, 
                            [field]: value,
                            // Clear end date if this is current position
                            endDate: value ? 'Present' : item.endDate 
                        };
                    }
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    // Update a specific bullet point
    const updateBulletPoint = (experienceId, index, value) => {
        setExperienceList(
            experienceList.map(item => {
                if (item.id === experienceId) {
                    const updatedBulletPoints = [...(item.bulletPoints || ['', '', ''])];
                    updatedBulletPoints[index] = value;
                    return { ...item, bulletPoints: updatedBulletPoints };
                }
                return item;
            })
        );
    };

    // Convert existing descriptions to bullet points if needed
    const ensureBulletPoints = () => {
        setExperienceList(
            experienceList.map(item => {
                if (!item.bulletPoints && item.description) {
                    // Split description by bullet points, newlines, or create empty bullet points
                    const description = item.description || '';
                    let points = [];
                    
                    if (description.includes('•')) {
                        points = description.split('•')
                            .map(point => point.trim())
                            .filter(point => point !== '');
                    } else if (description.includes('\n')) {
                        points = description.split('\n')
                            .map(point => point.trim())
                            .filter(point => point !== '');
                    }
                    
                    // Ensure we have at least 3 bullet points (even if empty)
                    while (points.length < 3) {
                        points.push('');
                    }
                    
                    return { ...item, bulletPoints: points, description: undefined };
                } else if (!item.bulletPoints) {
                    return { ...item, bulletPoints: ['', '', ''] };
                }
                return item;
            })
        );
    };

    // Ensure bullet points are initialized on component mount
    useEffect(() => {
        ensureBulletPoints();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="experienceContainer">
            <p className="sectionHeader">Work Experience</p>
            
            {experienceList.map((exp, index) => (
                <div key={exp.id} className="experienceEntry">
                    {index > 0 && <div className="entrySeparator"></div>}
                    
                    <div className="entryHeader">
                        <div className="headerTitleGroup">
                            <h3 className="entryTitle">Experience #{index + 1}</h3>
                            <button 
                                className={`aiButton ${reviewingId === exp.id ? 'generating' : ''}`}
                                title="Generate content with AI"
                                onClick={() => reviewAI(exp.id)}
                                disabled={reviewingId !== null}
                            >
                                {reviewingId === exp.id ? (
                                    <div className="loadingIndicator"></div>
                                ) : (
                                    <>
                                        <img src={starIcon} alt="AI" />
                                        <span className="aiTooltip">Generate with AI</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {experienceList.length > 1 && (
                            <button 
                                className="removeButton" 
                                onClick={() => removeExperience(exp.id)}
                                aria-label="Remove experience entry"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                    
                    <div className="formGroup">
                        <div className="inputWrapper">
                            <label htmlFor={`jobTitle-${exp.id}`}>Job Title</label>
                            <input 
                                id={`jobTitle-${exp.id}`}
                                className="input" 
                                type="text" 
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                placeholder="Ex: Software Developer" 
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`company-${exp.id}`}>Company</label>
                            <input 
                                id={`company-${exp.id}`}
                                className="input" 
                                type="text" 
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder="Ex: Tech Solutions Inc."
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`location-${exp.id}`}>Location</label>
                            <input 
                                id={`location-${exp.id}`}
                                className="input" 
                                type="text" 
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                placeholder="Ex: Orlando, FL"
                            />
                        </div>
                        
                        <div className="dateGroup">
                            <div className="inputWrapper">
                                <label htmlFor={`startDate-${exp.id}`}>Start Date</label>
                                <input 
                                    id={`startDate-${exp.id}`}
                                    className="input" 
                                    type="text" 
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    placeholder="Ex: January 2020"
                                />
                            </div>
                            
                            <div className="inputWrapper">
                                <label htmlFor={`endDate-${exp.id}`}>End Date</label>
                                <input 
                                    id={`endDate-${exp.id}`}
                                    className="input" 
                                    type="text" 
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    placeholder="Ex: December 2022"
                                    disabled={exp.isCurrentPosition}
                                />
                            </div>
                        </div>
                        
                        <div className="checkboxWrapper">
                            <input
                                id={`currentPosition-${exp.id}`}
                                type="checkbox"
                                checked={exp.isCurrentPosition}
                                onChange={(e) => updateExperience(exp.id, 'isCurrentPosition', e.target.checked)}
                            />
                            <label htmlFor={`currentPosition-${exp.id}`}>
                                This is my current position
                            </label>
                        </div>
                    </div>
                    
                    <div className="bulletPointsContainer">
                        <label className="bulletPointsLabel">
                            Responsibilities & Achievements
                        </label>
                        
                        {/* Bullet Point 1 */}
                        <div className="bulletPointWrapper">
                            <span className="bulletPoint">•</span>
                            <input 
                                id={`bulletPoint1-${exp.id}`}
                                className="input bulletPointInput" 
                                type="text" 
                                value={exp.bulletPoints?.[0] || ''}
                                onChange={(e) => updateBulletPoint(exp.id, 0, e.target.value)}
                                placeholder="Ex: Led development of new features that increased user engagement by 30%" 
                            />
                        </div>
                        
                        {/* Bullet Point 2 */}
                        <div className="bulletPointWrapper">
                            <span className="bulletPoint">•</span>
                            <input 
                                id={`bulletPoint2-${exp.id}`}
                                className="input bulletPointInput" 
                                type="text" 
                                value={exp.bulletPoints?.[1] || ''}
                                onChange={(e) => updateBulletPoint(exp.id, 1, e.target.value)}
                                placeholder="Ex: Collaborated with cross-functional teams to deliver projects on time" 
                            />
                        </div>
                        
                        {/* Bullet Point 3 */}
                        <div className="bulletPointWrapper">
                            <span className="bulletPoint">•</span>
                            <input 
                                id={`bulletPoint3-${exp.id}`}
                                className="input bulletPointInput" 
                                type="text" 
                                value={exp.bulletPoints?.[2] || ''}
                                onChange={(e) => updateBulletPoint(exp.id, 2, e.target.value)}
                                placeholder="Ex: Implemented automated testing that reduced QA time by 25%" 
                            />
                        </div>
                    </div>
                </div>
            ))}
            
            <button 
                className="addButton"
                onClick={addExperience}
                type="button"
                disabled={reviewingId !== null}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Another Experience
            </button>
        </div>
    );
}