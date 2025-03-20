export default function Experience({ experienceList, setExperienceList }) {
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
                description: ''
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

    return (
        <div className="experienceContainer">
            <p className="sectionHeader">Work Experience</p>
            
            {experienceList.map((exp, index) => (
                <div key={exp.id} className="experienceEntry">
                    {index > 0 && <div className="entrySeparator"></div>}
                    
                    <div className="entryHeader">
                        <h3 className="entryTitle">Experience #{index + 1}</h3>
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
                    
                    <div className="textareaWrapper">
                        <label htmlFor={`description-${exp.id}`}>
                            Description (responsibilities, achievements, etc.)
                        </label>
                        <textarea 
                            id={`description-${exp.id}`}
                            className="textarea" 
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="• Led the development of a new product feature that increased user engagement by 30%
• Collaborated with cross-functional teams to deliver projects on time and within budget
• Implemented automated testing that reduced QA time by 25%"
                            rows={4}
                        ></textarea>
                        <p className="helperText">Use bullet points (•) to separate different responsibilities or achievements</p>
                    </div>
                </div>
            ))}
            
            <button 
                className="addButton"
                onClick={addExperience}
                type="button"
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