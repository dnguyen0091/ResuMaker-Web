import React, { useEffect, useState } from 'react';
import starIcon from '../../../assets/Icons/stars.svg';

export default function CustomSection({ section, onChange }) {
    const [reviewingId, setReviewingId] = useState(null);
    
    // Get the entries list and section title from the section prop
    const { title, entries } = section;

    // Update the section title
    const updateSectionTitle = (newTitle) => {
        onChange({
            ...section,
            title: newTitle
        });
    };

    // AI review function for items
    const reviewAI = (itemId) => {
        // Set the reviewing state to show loading indicator
        setReviewingId(itemId);
        
        const item = entries.find(item => item.id === itemId);
        
        // Simulate AI generation (replace with actual API call)
        setTimeout(() => {
            // Example AI-generated content based on the section title
            const sectionType = title.toLowerCase();
            let generatedBulletPoints = [];
            
            if (sectionType.includes('skill') || sectionType.includes('technical')) {
                generatedBulletPoints = [
                    `Advanced proficiency in ${item.title || 'relevant technologies'}`,
                    `Applied ${item.title || 'these skills'} to solve complex problems`,
                    `Continuously learning and improving ${item.title || 'skill set'}`
                ];
            } else if (sectionType.includes('project')) {
                generatedBulletPoints = [
                    `Led development of ${item.title || 'project'} that achieved significant metrics`,
                    `Implemented innovative solutions to overcome technical challenges`,
                    `Collaborated with team members to ensure timely delivery`
                ];
            } else if (sectionType.includes('volunteer') || sectionType.includes('community')) {
                generatedBulletPoints = [
                    `Contributed over 100 hours to ${item.title || 'this initiative'}`,
                    `Helped organize events that benefited the local community`,
                    `Received recognition for outstanding contributions`
                ];
            } else {
                generatedBulletPoints = [
                    `Demonstrated excellence in ${item.title || 'this area'}`,
                    `Applied specialized knowledge to achieve measurable results`,
                    `Received recognition for outstanding performance`
                ];
            }
            
            // Update the entry with AI suggestions
            const updatedEntries = entries.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        bulletPoints: generatedBulletPoints
                    };
                }
                return item;
            });
            
            onChange({
                ...section,
                entries: updatedEntries
            });
            
            // Clear the reviewing state
            setReviewingId(null);
        }, 1500);
    };
    
    // Add a new entry
    const addEntry = () => {
        const newId = entries.length > 0 
            ? Math.max(...entries.map(item => item.id)) + 1 
            : 1;
            
        onChange({
            ...section,
            entries: [
                ...entries,
                {
                    id: newId,
                    title: '',
                    subtitle: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrentPosition: false,
                    bulletPoints: ['', '', '']
                }
            ]
        });
    };

    // Remove an entry
    const removeEntry = (id) => {
        if (entries.length <= 1) return;
        
        onChange({
            ...section,
            entries: entries.filter(item => item.id !== id)
        });
    };

    // Update an entry
    const updateEntry = (id, field, value) => {
        onChange({
            ...section,
            entries: entries.map(item => {
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
        });
    };

    // Update a specific bullet point
    const updateBulletPoint = (entryId, index, value) => {
        onChange({
            ...section,
            entries: entries.map(item => {
                if (item.id === entryId) {
                    const updatedBulletPoints = [...(item.bulletPoints || ['', '', ''])];
                    updatedBulletPoints[index] = value;
                    return { ...item, bulletPoints: updatedBulletPoints };
                }
                return item;
            })
        });
    };

    // Convert existing descriptions to bullet points if needed
    const ensureBulletPoints = () => {
        const updatedEntries = entries.map(item => {
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
        });
        
        if (JSON.stringify(updatedEntries) !== JSON.stringify(entries)) {
            onChange({
                ...section,
                entries: updatedEntries
            });
        }
    };

    // Ensure bullet points are initialized on component mount
    useEffect(() => {
        ensureBulletPoints();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="customSectionContainer">
            <div className="sectionTitleContainer">
                <input
                    type="text"
                    className="sectionTitleInput"
                    value={title}
                    onChange={(e) => updateSectionTitle(e.target.value)}
                    placeholder="Section Title (e.g. Skills, Projects, Certifications)"
                />
            </div>
            
            {entries.map((entry, index) => (
                <div key={entry.id} className="customEntry">
                    {index > 0 && <div className="entrySeparator"></div>}
                    
                    <div className="entryHeader">
                        <div className="headerTitleGroup">
                            <h3 className="entryTitle">{title} #{index + 1}</h3>
                            <button 
                                className={`aiButton ${reviewingId === entry.id ? 'generating' : ''}`}
                                title="Generate content with AI"
                                onClick={() => reviewAI(entry.id)}
                                disabled={reviewingId !== null}
                            >
                                {reviewingId === entry.id ? (
                                    <div className="loadingIndicator"></div>
                                ) : (
                                    <>
                                        <img src={starIcon} alt="AI" />
                                        <span className="aiTooltip">Generate with AI</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {entries.length > 1 && (
                            <button 
                                className="removeButton" 
                                onClick={() => removeEntry(entry.id)}
                                aria-label="Remove entry"
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
                            <label htmlFor={`title-${entry.id}`}>Title</label>
                            <input 
                                id={`title-${entry.id}`}
                                className="input" 
                                type="text" 
                                value={entry.title}
                                onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                                placeholder="Ex: Project Name, Skill, Certification" 
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`subtitle-${entry.id}`}>Subtitle/Organization</label>
                            <input 
                                id={`subtitle-${entry.id}`}
                                className="input" 
                                type="text" 
                                value={entry.subtitle}
                                onChange={(e) => updateEntry(entry.id, 'subtitle', e.target.value)}
                                placeholder="Ex: Organization, Issuer, Technology"
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`location-${entry.id}`}>Location</label>
                            <input 
                                id={`location-${entry.id}`}
                                className="input" 
                                type="text" 
                                value={entry.location}
                                onChange={(e) => updateEntry(entry.id, 'location', e.target.value)}
                                placeholder="Ex: Remote, Orlando, FL"
                            />
                        </div>
                        
                        <div className="dateGroup">
                            <div className="inputWrapper">
                                <label htmlFor={`startDate-${entry.id}`}>Start Date</label>
                                <input 
                                    id={`startDate-${entry.id}`}
                                    className="input" 
                                    type="text" 
                                    value={entry.startDate}
                                    onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                                    placeholder="Ex: January 2020"
                                />
                            </div>
                            
                            <div className="inputWrapper">
                                <label htmlFor={`endDate-${entry.id}`}>End Date</label>
                                <input 
                                    id={`endDate-${entry.id}`}
                                    className="input" 
                                    type="text" 
                                    value={entry.endDate}
                                    onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                                    placeholder="Ex: December 2022"
                                    disabled={entry.isCurrentPosition}
                                />
                            </div>
                        </div>
                        
                        <div className="checkboxWrapper">
                            <input
                                id={`currentPosition-${entry.id}`}
                                type="checkbox"
                                checked={entry.isCurrentPosition}
                                onChange={(e) => updateEntry(entry.id, 'isCurrentPosition', e.target.checked)}
                            />
                            <label htmlFor={`currentPosition-${entry.id}`}>
                                This is current/ongoing
                            </label>
                        </div>
                    </div>
                    
                    <div className="bulletPointsContainer">
                        <label className="bulletPointsLabel">
                            Details & Highlights
                        </label>
                        
                        {/* Bullet Point 1 */}
                        <div className="bulletPointWrapper">
                            <span className="bulletPoint">•</span>
                            <input 
                                id={`bulletPoint1-${entry.id}`}
                                className="input bulletPointInput" 
                                type="text" 
                                value={entry.bulletPoints?.[0] || ''}
                                onChange={(e) => updateBulletPoint(entry.id, 0, e.target.value)}
                                placeholder="Ex: Developed a feature that improved user experience" 
                            />
                        </div>
                        
                        {/* Bullet Point 2 */}
                        <div className="bulletPointWrapper">
                            <span className="bulletPoint">•</span>
                            <input 
                                id={`bulletPoint2-${entry.id}`}
                                className="input bulletPointInput" 
                                type="text" 
                                value={entry.bulletPoints?.[1] || ''}
                                onChange={(e) => updateBulletPoint(entry.id, 1, e.target.value)}
                                placeholder="Ex: Collaborated with team members to achieve goals" 
                            />
                        </div>
                        
                        {/* Bullet Point 3 */}
                        <div className="bulletPointWrapper">
                            <span className="bulletPoint">•</span>
                            <input 
                                id={`bulletPoint3-${entry.id}`}
                                className="input bulletPointInput" 
                                type="text" 
                                value={entry.bulletPoints?.[2] || ''}
                                onChange={(e) => updateBulletPoint(entry.id, 2, e.target.value)}
                                placeholder="Ex: Received recognition for outstanding contributions" 
                            />
                        </div>
                    </div>
                </div>
            ))}
            
            <button 
                className="addButton"
                onClick={addEntry}
                type="button"
                disabled={reviewingId !== null}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Another {title || 'Entry'}
            </button>
        </div>
    );
}