// Updated Builder.jsx with animated transitions for all sections
import { useState, useEffect, useRef } from 'react';
import DisplayPreview from './displayPreview';
import CustomSection from './FormBuilders/CustomSection';
import Education from './FormBuilders/Education';
import Experience from './FormBuilders/Experience';
import PersonalInfo from './FormBuilders/PersonalInfo';
import './resumeBuilder.css';

export default function Builder() {
  const [personalInfo, setPersonalInfo] = useState({
    name: '', location: '', email: '', phone: '', linkedin: ''
  });

  const [educationList, setEducationList] = useState([{ id: 1, school: '', location: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', bulletPoints: ['', ''] }]);

  const [experienceList, setExperienceList] = useState([{ id: 1, title: '', company: '', location: '', startDate: '', endDate: '', isCurrentPosition: false, bulletPoints: ['', ''] }]);

  const [customSections, setCustomSections] = useState([{ id: 1, title: 'CLICK TO EDIT SECTION TITLE', entries: [{ id: 1, title: '', subtitle: '', location: '', startDate: '', endDate: '', isCurrentPosition: false, bulletPoints: ['', '', ''] }] }]);

  const [collapsedSections, setCollapsedSections] = useState({
    personalInfo: false,
    education: true,
    experience: true,
    customSections: {}
  });

  const didInitCollapse = useRef(false);

  useEffect(() => {
    if (didInitCollapse.current) return;
    const defaultCustomCollapse = {};
    customSections.forEach(section => {
      defaultCustomCollapse[section.id] = true;
    });
    setCollapsedSections(prev => ({
      ...prev,
      customSections: defaultCustomCollapse
    }));
    didInitCollapse.current = true;
  }, [customSections]);

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCustomSection = (id) => {
    setCollapsedSections(prev => ({
      ...prev,
      customSections: {
        ...prev.customSections,
        [id]: !prev.customSections[id]
      }
    }));
  };

  const updateCustomSection = (sectionId, updatedSection) => {
    setCustomSections(
      customSections.map(section =>
        section.id === sectionId ? updatedSection : section
      )
    );
  };

  const addSection = () => {
    const newSectionId = customSections.length > 0 ? Math.max(...customSections.map(s => s.id)) + 1 : 1;
    const newSection = {
      id: newSectionId,
      title: 'CLICK TO EDIT SECTION TITLE',
      entries: [{ id: 1, title: '', subtitle: '', location: '', startDate: '', endDate: '', isCurrentPosition: false, bulletPoints: ['', '', ''] }]
    };
    setCustomSections([...customSections, newSection]);
    setCollapsedSections(prev => ({
      ...prev,
      customSections: {
        ...prev.customSections,
        [newSectionId]: true
      }
    }));
  };

  const removeCustomSection = (id) => {
    setCustomSections(customSections.filter(section => section.id !== id));
    setCollapsedSections(prev => {
      const updated = { ...prev.customSections };
      delete updated[id];
      return {
        ...prev,
        customSections: updated
      };
    });
  };

  const resumeData = { personalInfo, education: educationList, experience: experienceList, customSections };

  return (
    <div className="resume-builder-page">
      <div className="builder-container">
        <div className="builder-scroll-wrapper">
            <div className="builder-section">
            {/* Personal Info */}
            <div className={`collapsible-section ${!collapsedSections.personalInfo ? 'expanded' : ''}`}>
                <div className="collapsible-header" onClick={() => toggleSection('personalInfo')}>
                <h3>Personal Info</h3>
                <span className={`arrow-icon ${collapsedSections.personalInfo ? 'collapsed' : 'expanded'}`}>▶</span>
                </div>
                <div className="collapsible-content">
                <PersonalInfo personalInfo={personalInfo} onChange={(f, v) => setPersonalInfo({ ...personalInfo, [f]: v })} />
                </div>
            </div>

            {/* Education */}
            <div className={`collapsible-section ${!collapsedSections.education ? 'expanded' : ''}`}>
                <div className="collapsible-header" onClick={() => toggleSection('education')}>
                <h3>Education</h3>
                <span className={`arrow-icon ${collapsedSections.education ? 'collapsed' : 'expanded'}`}>▶</span>
                </div>
                <div className="collapsible-content">
                <Education educationList={educationList} setEducationList={setEducationList} />
                </div>
            </div>

            {/* Experience */}
            <div className={`collapsible-section ${!collapsedSections.experience ? 'expanded' : ''}`}>
                <div className="collapsible-header" onClick={() => toggleSection('experience')}>
                <h3>Experience</h3>
                <span className={`arrow-icon ${collapsedSections.experience ? 'collapsed' : 'expanded'}`}>▶</span>
                </div>
                <div className="collapsible-content">
                <Experience experienceList={experienceList} setExperienceList={setExperienceList} />
                </div>
            </div>

            {/* Custom Sections */}
            {customSections.map(section => (
                <div key={section.id} className={`collapsible-section ${!collapsedSections.customSections?.[section.id] ? 'expanded' : ''}`}>
                <div className="collapsible-header" onClick={() => toggleCustomSection(section.id)}>
                <div className="custom-header-controls">
                  <button
                    className="removeSectionButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomSection(section.id);
                    }}
                    title="Remove Section"
                  >
                    ✖
                  </button>
                  <h3>{section.title}</h3>
                  <span
                    className={`arrow-icon ${collapsedSections.customSections?.[section.id] ? 'collapsed' : 'expanded'}`}
                  >
                    ▶
                  </span>
                </div>
                </div>
                <div className="collapsible-content">
                    <CustomSection section={section} onChange={(s) => updateCustomSection(section.id, s)} />
                </div>
                </div>
            ))}

            <button className="addSectionButton" onClick={addSection}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Another Section
            </button>
          </div>
        </div>
        <div className="preview-section">
          <DisplayPreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
