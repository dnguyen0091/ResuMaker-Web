import React from 'react';


export default function Education({ educationList, setEducationList }) {
    // Add a new education entry
    const addEducation = () => {
        const newId = educationList.length > 0 
            ? Math.max(...educationList.map(item => item.id)) + 1 
            : 1;
            
        setEducationList([
            ...educationList,
            {
                id: newId,
                school: '',
                location: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                description: ''
            }
        ]);
    };

    // Remove an education entry
    const removeEducation = (id) => {
        if (educationList.length <= 1) return;
        setEducationList(educationList.filter(item => item.id !== id));
    };

    // Update an education entry
    const updateEducation = (id, field, value) => {
        setEducationList(
            educationList.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };


    return (
        <div className="educationContainer">
            <p className="sectionHeader">Education</p>
            
            {educationList.map((edu, index) => (
                <div key={edu.id} className="educationEntry">
                    {index > 0 && <div className="entrySeparator"></div>}
                    
                    <div className="entryHeader">
                        <h3 className="entryTitle">Education #{index + 1}</h3>
                        {educationList.length > 1 && (
                            <button 
                                className="removeButton" 
                                onClick={() => removeEducation(edu.id)}
                                aria-label="Remove education entry"
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
                            <label htmlFor={`school-${edu.id}`}>School/University</label>
                            <input 
                                id={`school-${edu.id}`}
                                className="input" 
                                type="text" 
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                placeholder="Ex: University of Central Florida" 
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`location-${edu.id}`}>Location</label>
                            <input 
                                id={`location-${edu.id}`}
                                className="input" 
                                type="text" 
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                placeholder="Ex: Orlando, FL"
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`degree-${edu.id}`}>Degree</label>
                            <input 
                                id={`degree-${edu.id}`}
                                className="input" 
                                type="text" 
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                placeholder="Ex: Bachelor of Science"
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`fieldOfStudy-${edu.id}`}>Field of Study</label>
                            <input 
                                id={`fieldOfStudy-${edu.id}`}
                                className="input" 
                                type="text" 
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                                placeholder="Ex: Computer Science"
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`startDate-${edu.id}`}>Start Date</label>
                            <input 
                                id={`startDate-${edu.id}`}
                                className="input" 
                                type="text" 
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                placeholder="Ex: September 2019"
                            />
                        </div>
                        
                        <div className="inputWrapper">
                            <label htmlFor={`endDate-${edu.id}`}>End Date (or Expected)</label>
                            <input 
                                id={`endDate-${edu.id}`}
                                className="input" 
                                type="text" 
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                placeholder="Ex: May 2023 or Present"
                            />
                        </div>
                    </div>
                    
                    <div className="textareaWrapper">
                        <label htmlFor={`description-${edu.id}`}>
                            Additional Information (achievements, activities, etc.)
                        </label>
                        <textarea 
                            id={`description-${edu.id}`}
                            className="textarea" 
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                            placeholder="Ex: Dean's List 2019-2022, President of Computer Science Club, Coursework included Machine Learning and Software Engineering"
                            rows={3}
                        ></textarea>
                    </div>
                </div>
            ))}
            
            <button 
                className="addButton"
                onClick={addEducation}
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Another Education
            </button>
        </div>
    );
}