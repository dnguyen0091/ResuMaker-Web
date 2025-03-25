import { useEffect } from 'react';
import './resumeAnalyzer.css';

export default function Results({ pdfData, onReset }) {
    // Clean up the file URL when component unmounts to prevent memory leaks
    useEffect(() => {
        return () => {
            if (pdfData && pdfData.fileUrl) {
                URL.revokeObjectURL(pdfData.fileUrl);
            }
        };
    }, [pdfData]);
    
    // Function to determine score color based on value
    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--accent)';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    if (!pdfData) return null;

    return (
        <div className="results-page">
            <div className="results-container">
                <div className="results-header">
                    <p className="pageTitle">Resume Analysis Results</p> {/* Fixed class to className */}
                </div>
                
                <div className="results-content">
                    {/* PDF Preview Section */}
                    <div className="pdf-preview-section">
                        <p className="resultTitle">Your Resume</p>
                        <div className="pdf-container">
                            <iframe 
                                src={`${pdfData.fileUrl}#toolbar=0`} 
                                title="Resume Preview" 
                                className="pdf-preview"
                            ></iframe>
                        </div>
                        <div id="extraInfo">
                            <div className="file-info">
                                <p><strong>File:</strong> {pdfData.fileName}</p>
                                <p><strong>Uploaded:</strong> {new Date(pdfData.uploadDate).toLocaleString()}</p>
                            </div>
                            <button className="reset-button" onClick={onReset}>
                                Analyze Another Resume
                            </button>
                        </div>
                    </div>
                    
                    {/* Analysis Results Section */}
                    <div className="analysis-section">
                        <p className="resultTitle">Analysis</p>
                        
                        <div className="overall-score">
                            <div className="score-circle">
                                <span style={{ color: 'var(--accent)' }}>{pdfData.score}%</span>
                            </div>
                            <p>Overall Score</p>
                        </div>
                        
                        <div className="score-categories">
                            <div className="score-category">
                                <h3>Keyword Match</h3>
                                <div className="score-bar">
                                    <div 
                                        className="score-fill" 
                                        style={{ 
                                            width: `${pdfData.keywordMatch}%`,
                                            backgroundColor: getScoreColor(pdfData.keywordMatch)
                                        }}
                                    ></div>
                                </div>
                                <span>{pdfData.keywordMatch}%</span>
                            </div>
                            
                            <div className="score-category">
                                <h3>Formatting</h3>
                                <div className="score-bar">
                                    <div 
                                        className="score-fill" 
                                        style={{ 
                                            width: `${pdfData.formatting}%`,
                                            backgroundColor: getScoreColor(pdfData.formatting)
                                        }}
                                    ></div>
                                </div>
                                <span>{pdfData.formatting}%</span>
                            </div>
                            
                            <div className="score-category">
                                <h3>Content Quality</h3>
                                <div className="score-bar">
                                    <div 
                                        className="score-fill" 
                                        style={{ 
                                            width: `${pdfData.contentQuality}%`,
                                            backgroundColor: getScoreColor(pdfData.contentQuality)
                                        }}
                                    ></div>
                                </div>
                                <span>{pdfData.contentQuality}%</span>
                            </div>
                        </div>
                        
                        <div className="suggestions">
                            <h3>Suggestions for Improvement</h3>
                            <ul>
                                {pdfData.suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}