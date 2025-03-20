import { useState } from 'react';
import Education from './FormBuilders/Education';
import Experience from './FormBuilders/Experience';
import PersonalInfo from './FormBuilders/PersonalInfo';
import DisplayPreview from './displayPreview';
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
            description: ''
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
            description: ''
        }
    ]);

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
        experience: experienceList
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
                </div>
                
                <div className="preview-section">
                    <DisplayPreview resumeData={resumeData} />
                </div>
            </div>
        </div>
    );
}