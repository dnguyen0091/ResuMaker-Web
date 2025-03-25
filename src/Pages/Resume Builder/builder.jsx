import { useState } from 'react';
import DisplayPreview from './displayPreview';
import CustomSection from './FormBuilders/CustomSection';
import Education from './FormBuilders/Education';
import Experience from './FormBuilders/Experience';
import PersonalInfo from './FormBuilders/PersonalInfo';
import './resumeBuilder.css';

export default function Builder() {
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        location: '',
        email: '',
        phone: '',
        linkedin: ''
    });
    
    const [educationList, setEducationList] = useState([
        {
            id: 1,
            school: '',
            location: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            bulletPoints: ['', '']
        }
    ]);
    
    const [experienceList, setExperienceList] = useState([
        {
            id: 1,
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrentPosition: false,
            bulletPoints: ['', '']
        }
    ]);

    // Add this to your builder.jsx state
    const [customSections, setCustomSections] = useState([
        {
            id: 1,
            title: 'CLICK TO EDIT SECTION TITLE',
            entries: [
                {
                    id: 1,
                    title: '',
                    subtitle: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrentPosition: false,
                    bulletPoints: ['', '', '']
                }
            ]
        }
    ]);

    // Add this handler function
    const updateCustomSection = (sectionId, updatedSection) => {
        setCustomSections(
            customSections.map(section => 
                section.id === sectionId ? updatedSection : section
            )
        );
    };

    // Replace the existing addSection function with this corrected version:
    const addSection = () => {
        // Create a new ID for the section
        const newSectionId = customSections.length > 0 
            ? Math.max(...customSections.map(section => section.id)) + 1 
            : 1;
        
        // Create a new custom section with default values
        const newSection = {
            id: newSectionId,
            title: 'CLICK TO EDIT SECTION TITLE',
            entries: [
                {
                    id: 1,
                    title: '',
                    subtitle: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrentPosition: false,
                    bulletPoints: ['', '', '']
                }
            ]
        };
        
        // Add the new section to the customSections state
        setCustomSections([...customSections, newSection]);
    };
// And in your render function, map through custom sections:

    const handlePersonalInfoChange = (field, value) => {
        setPersonalInfo({
            ...personalInfo,
            [field]: value
        });
    };

    // Combine all resume data into a single object to pass to the preview
    const resumeData = {
        personalInfo,
        education: educationList,
        experience: experienceList,
        customSections: customSections
    };

    return (
        <div className="resume-builder-page">
            <div className="builder-container">
                
                    <div className="builder-section">
                        <PersonalInfo 
                            personalInfo={personalInfo} 
                            onChange={handlePersonalInfoChange}
                        />
                        
                        <Education 
                            educationList={educationList} 
                            setEducationList={setEducationList} 
                        />
                        
                        <Experience
                            experienceList={experienceList}
                            setExperienceList={setExperienceList}
                        />
                        
                        {customSections.map((section) => (
                            <CustomSection 
                                key={section.id}
                                section={section}
                                onChange={(updatedSection) => updateCustomSection(section.id, updatedSection)}
                            />
                        ))}
                        
                        {/* Move the button inside the builder-section div */}
                        <button className="addSectionButton" onClick={addSection}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Another Section
                        </button>
                    </div>
                
                
                <div className="preview-section">
                    <DisplayPreview resumeData={resumeData} />
                </div>
            </div>
        </div>
    );
}