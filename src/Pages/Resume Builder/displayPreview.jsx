// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
// import downloadIcon from '../../assets/Icons/download.svg';
// import saveIcon from '../../assets/Icons/save.svg';
import './Preview/Custom.css';
import './Preview/EducationExperience.css';
import './Preview/preview.css';
import './Preview/resumeContent.css';
import './resumeBuilder.css';
import { pdf } from '@react-pdf/renderer';
import MyPDFDocument from './pdfDocument';

/**
 * A PDF preview component that updates in real-time as the user inputs data
 * @param {Object} resumeData - The resume data from the builder form
 */
export default function DisplayPreview({ resumeData = {} }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const resumeRef = useRef(null);
  
  // Destructure the resumeData for easier access
  // const { personalInfo = {}, education = [], experience = [] } = resumeData;
  const { personalInfo, education, experience, customSections = [] } = resumeData;
  // Calculate page count whenever content changes
  useEffect(() => {
    if (!resumeRef.current) return;
    
    // Get the height of the content
    const height = resumeRef.current.scrollHeight;
    setContentHeight(height);
    
    // Calculate number of pages based on A4 dimensions
    // A4 is 210mm × 297mm, with 1in margins that's roughly 160mm × 247mm usable space
    // We need to calculate based on the current width to get proportion right
    const contentWidth = resumeRef.current.clientWidth;
    const a4Ratio = 210 / 297; // width / height
    const contentRatio = contentWidth / height;
    
    // This calculation gives us approximate page count based on content area
    const estimatedPages = Math.ceil(height / (contentWidth / a4Ratio));
    setPageCount(estimatedPages);
  }, [resumeData]);

  /**
   * Generates and downloads a PDF of the current preview content
   */
  const downloadPDF = async () => {
    if (!resumeData) return;
    setIsGenerating(true);
  
    try {
      const blob = await pdf(<MyPDFDocument resumeData={resumeData} />).toBlob();
  
      const fileName = personalInfo.name 
        ? `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : `MyResume.pdf`;
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating real PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const savePDF = async () => {
    //Connect to the backend to save the pdf
    console.log("Save PDF Clicked");
  };
  // Check if there's any personal info data to display
  const hasPersonalInfo = personalInfo && Object.values(personalInfo).some(value => value && value.trim && value.trim() !== '');
  
  // Check if there's any education data to display
  const hasEducation = education && education.length > 0 && education.some(edu => 
    edu.school && edu.school.trim() !== '' || 
    edu.degree && edu.degree.trim() !== ''
  );
  
  // Check if there's any experience data to display
  const hasExperience = experience && experience.length > 0 && experience.some(exp => 
    exp.title && exp.title.trim() !== '' || 
    exp.company && exp.company.trim() !== ''
  );
  
  // Function to format description with bullet points
  const formatDescription = (description) => {
    if (!description) return null;
    
    // If the description already contains bullet points, render as is
    if (description.includes('•')) {
      return (
        <div className="description-bullets">
          {description.split('\n').map((line, i) => (
            <div key={i} className="bullet-point">{line}</div>
          ))}
        </div>
      );
    }
    
    // Otherwise, render as a paragraph
    return <p className="description-text">{description}</p>;
  };

  return (
    <div className="preview-container">
      {/* Header with download button */}
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <div className="preview-actions">
          <button className="saveButton" onClick={savePDF}><img src={saveIcon} alt="Save" /></button>
          <button className="download-button" onClick={downloadPDF} disabled={isGenerating}><img src={downloadIcon} alt="download" />{/* {isGenerating ? 'Generating...' : 'Download PDF'} */}</button>
        </div>
      </div>
      
      {/* The preview area - this will contain the resume content */}
      <div className="preview-area">
        <div className="resume-wrapper">
          <div className="paper-size-indicator"></div>
          {/* This div will be converted to PDF - referenced by resumeRef */}
          <div className="resume-document a4-paper" ref={resumeRef}>
            {/* Personal Info Section - Rendered if we have data */}
            {hasPersonalInfo ? (
              <div className="resume-header">
                <h1 className="resume-name">{personalInfo.name || 'Your Name'}</h1>
                
                <div className="resume-contact-info">
                  {personalInfo.location && (
                    <div className="contact-item">
                      <span className="contact-icon">📍</span>
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  
                  {personalInfo.email && (
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  
                  {personalInfo.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  
                  {personalInfo.linkedin && (
                    <div className="contact-item">
                      <span className="contact-icon">🔗</span>
                      <span>{personalInfo.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="resume-placeholder">
                <p>Your resume will appear here</p>
                <p className="placeholder-hint">Content from the builder will be displayed in real-time</p>
              </div>
            )}
            
            {/* Only show content sections if we have personal info */}
            {hasPersonalInfo && (
              <>
                {/* Education Section */}
                {hasEducation && (
                  <div className="resume-section">
                    <h2 className="section-title">Education</h2>
                    
                    {education.filter(edu => 
                      edu.school && edu.school.trim() !== '' || 
                      edu.degree && edu.degree.trim() !== ''
                    ).map((edu, index) => (
                      <div key={edu.id || index} className="education-entry">
                        <div className="entry-header">
                          <div className="main-details">
                            {edu.degree && (
                              <h3 className="degree">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                            )}
                            {edu.school && (
                              <h4 className="school">{edu.school}</h4>
                            )}
                          </div>
                          
                          <div className="date-location">
                            {(edu.startDate || edu.endDate) && (
                              <div className="date-range">
                                {edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}
                              </div>
                            )}
                            {edu.location && (
                              <div className="location">{edu.location}</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Handle bullet points */}
                        {edu.bulletPoints && edu.bulletPoints.some(point => point && point.trim() !== '') && (
                          <div className="entry-description">
                            <ul className="description-bullets">
                              {edu.bulletPoints.map((point, i) => 
                                point && point.trim() !== '' ? (
                                  <li key={i} className="bullet-point">{point}</li>
                                ) : null
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {/* Backward compatibility for description field */}
                        {!edu.bulletPoints && edu.description && (
                          <div className="entry-description">
                            {formatDescription(edu.description)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Experience Section */}
                {hasExperience && (
                  <div className="resume-section">
                    <h2 className="section-title">Experience</h2>
                    
                    {experience.filter(exp => 
                      exp.title && exp.title.trim() !== '' || 
                      exp.company && exp.company.trim() !== ''
                    ).map((exp, index) => (
                      <div key={exp.id || index} className="experience-entry">
                        <div className="entry-header">
                          <div className="main-details">
                            {exp.title && (
                              <h3 className="job-title">{exp.title}</h3>
                            )}
                            {exp.company && (
                              <h4 className="company">{exp.company}</h4>
                            )}
                          </div>
                          
                          <div className="date-location">
                            {(exp.startDate || exp.endDate) && (
                              <div className="date-range">
                                {exp.startDate}
                                {exp.startDate && (exp.endDate || exp.isCurrentPosition) ? ' - ' : ''}
                                {exp.isCurrentPosition ? 'Present' : exp.endDate}
                              </div>
                            )}
                            {exp.location && (
                              <div className="location">{exp.location}</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Handle bullet points */}
                        {exp.bulletPoints && exp.bulletPoints.some(point => point && point.trim() !== '') && (
                          <div className="entry-description">
                            <ul className="description-bullets">
                              {exp.bulletPoints.map((point, i) => 
                                point && point.trim() !== '' ? (
                                  <li key={i} className="bullet-point">{point}</li>
                                ) : null
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {/* Backward compatibility for description field */}
                        {!exp.bulletPoints && exp.description && (
                          <div className="entry-description">
                            {formatDescription(exp.description)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {customSections.map((section) => (
                  section.entries && section.entries.some(entry => entry.title.trim() !== '') && (
                      <div key={section.id} className="resume-section">
                          <h2 className="section-title">{section.title || 'Custom Section'}</h2>
                          
                          {section.entries.filter(entry => 
                              entry.title && entry.title.trim() !== ''
                          ).map((entry, index) => (
                              <div key={entry.id || index} className="custom-entry">
                                  <div className="entry-header">
                                      <div className="main-details">
                                          {entry.title && (
                                              <h3 className="item-title">{entry.title}</h3>
                                          )}
                                          {entry.subtitle && (
                                              <h4 className="item-subtitle">{entry.subtitle}</h4>
                                          )}
                                      </div>
                                      
                                      <div className="date-location">
                                          {(entry.startDate || entry.endDate) && (
                                              <div className="date-range">
                                                  {entry.startDate}
                                                  {entry.startDate && (entry.endDate || entry.isCurrentPosition) ? ' - ' : ''}
                                                  {entry.isCurrentPosition ? 'Present' : entry.endDate}
                                              </div>
                                          )}
                                          {entry.location && (
                                              <div className="location">{entry.location}</div>
                                          )}
                                      </div>
                                  </div>
                                  
                                  {/* Handle bullet points */}
                                  {entry.bulletPoints && entry.bulletPoints.some(point => point && point.trim() !== '') && (
                                      <div className="entry-description">
                                          <ul className="description-bullets">
                                              {entry.bulletPoints.map((point, i) => 
                                                  point && point.trim() !== '' ? (
                                                      <li key={i} className="bullet-point">{point}</li>
                                                  ) : null
                                              )}
                                          </ul>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  )
              ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}