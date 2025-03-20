import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react';
import './resumeBuilder.css';

/**
 * A PDF preview component that updates in real-time as the user inputs data
 * @param {Object} resumeData - The resume data from the builder form
 */
export default function DisplayPreview({ resumeData = {} }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef(null);
  
  // Destructure the resumeData for easier access
  const { personalInfo = {}, education = [], experience = [] } = resumeData;

  /**
   * Generates and downloads a PDF of the current preview content
   */
  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      setIsGenerating(true);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: '#FFFFFF'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit the content properly on the PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Generate a filename with the person's name if available
      const fileName = personalInfo.name 
        ? `${personalInfo.name.replace(/\s+/g, '_')}_Resume_${new Date().toISOString().slice(0, 10)}.pdf`
        : `MyResume_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Download the PDF
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
        <button 
          className="download-button"
          onClick={downloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
      
      {/* The preview area - this will contain the resume content */}
      <div className="preview-area">
        <div className="resume-wrapper">
          {/* This div will be converted to PDF - referenced by resumeRef */}
          <div className="resume-document" ref={resumeRef}>
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
                        
                        {edu.description && (
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
                        
                        {exp.description && (
                          <div className="entry-description">
                            {formatDescription(exp.description)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}