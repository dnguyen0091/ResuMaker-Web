// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import downloadIcon from '../../assets/Icons/download.svg';
import saveIcon from '../../assets/Icons/save.svg';
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
    console.log("Save PDF Clicked");
  
    if (!resumeData) return;
    setIsGenerating(true);
  
    try {
      // Get user first
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        throw new Error('User email not found. Please log in again.');
      }
  
      const API_URL = 'https://resumaker-api.onrender.com';
      const blob = await pdf(<MyPDFDocument resumeData={resumeData} />).toBlob();
      const fileName = personalInfo?.name 
        ? `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : `MyResume.pdf`;
      
      // Create a File object from the blob
      const file = new File([blob], fileName, { type: 'application/pdf' });
      
      // Create FormData to send the file - order can be important
      const formData = new FormData();
      formData.append('resume', file); // This should match the field name expected by multer
      formData.append('email', user.email);
      
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'file' ? '[File object]' : pair[1]));
      }
      
      // Send the request to the server - use the correct endpoint path
      const response = await fetch(`${API_URL}/api/resume/upload-resume`, {
        method: 'POST',
        body: formData,
        // No headers for multipart/form-data
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to save resume: ${response.status}`);
        } else {
          const text = await response.text();
          console.error("Server response:", text);
          throw new Error(`Server error (${response.status}). Check console for details.`);
        }
      }
      
      const data = await response.json();
      console.log('Resume saved successfully:', data);
      
      // Show success message to user
      console.log('Resume saved successfully!');
      
    } catch (error) {
      console.error("Error saving resume:", error);
      console.log(`Failed to save resume: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPageBreakMarkers = () => {
    const breaks = [];
    const fullPageHeight = 842;
    const topPadding = 43;
    const bottomPadding = 43;
    const usablePageHeight = fullPageHeight - topPadding - bottomPadding;
  
    const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--preview-scale')) || 1;
    const scaledUsableHeight = usablePageHeight * scale;
  
    const totalHeight = contentHeight * scale;
  
    const numBreaks = Math.floor(totalHeight / scaledUsableHeight);
    for (let i = 1; i <= numBreaks; i++) {
      breaks.push(i * scaledUsableHeight / scale);
    }
    return breaks;
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
        {hasPersonalInfo &&
          getPageBreakMarkers().map((top, index) => (
            <div
              key={index}
              className="page-break-indicator"
              style={{ top: `${top}px` }}
            />
          ))}

          {/* <div className="paper-size-indicator"></div> */}
          {/* This div will be converted to PDF - referenced by resumeRef */}
          <div className="resume-document a4-paper" ref={resumeRef}>
            {/* Personal Info Section - Rendered if we have data */}
            {hasPersonalInfo ? (
              <div className="resume-header">
                <h1 className="resume-name">{personalInfo.name || 'Your Name'}</h1>
                
                <div className="resume-contact-info">
                  {[
                    personalInfo.location,
                    personalInfo.email,
                    personalInfo.phone,
                    personalInfo.linkedin
                  ]
                    .filter(Boolean)
                    .map((item, index, array) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="contact-separator">|</span>}
                        <span className="contact-item">{item}</span>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            ) : (
              <div
                className="resume-placeholder"
                style={{
                  height: `${getPageBreakMarkers()[0] || 770}px`,
                  padding: '2rem 1.5rem',
                  boxSizing: 'border-box',
                }}
              >
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
