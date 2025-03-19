import { useEffect } from 'react';
import './resumeAnalyzer';

export default function Results({ pdfData, onReset }) {
    // Clean up the file URL when component unmounts to prevent memory leaks
    useEffect(() => {
        return () => {
            if (pdfData && pdfData.fileUrl) {
                URL.revokeObjectURL(pdfData.fileUrl);
            }
        };
    }, [pdfData]);

    if (!pdfData) return null;

    return (
        <div className="results-page">
            <div className="results-container">
                <div className="results-header">
                    <h1>Resume Analysis Results</h1>
                    <button className="reset-button" onClick={onReset}>
                        Analyze Another Resume
                    </button>
                </div>
                
                <div className="results-content">
                    {/* PDF Preview Section */}
                    <div className="pdf-preview-section">
                        <h2>Your Resume</h2>
                        <div className="pdf-container">
                            <iframe 
                                src={`${pdfData.fileUrl}#toolbar=0`} 
                                title="Resume Preview" 
                                className="pdf-preview"
                            ></iframe>
                        </div>
                        <div className="file-info">
                            <p><strong>File:</strong> {pdfData.fileName}</p>
                            <p><strong>Uploaded:</strong> {new Date(pdfData.uploadDate).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    {/* Analysis Results Section */}
                    <div className="analysis-section">
                        <h2>Analysis</h2>
                        
                        <div className="overall-score">
                            <div className="score-circle">
                                <span>{pdfData.score}%</span>
                            </div>
                            <p>Overall Score</p>
                        </div>
                        
                        <div className="score-categories">
                            <div className="score-category">
                                <h3>Keyword Match</h3>
                                <div className="score-bar">
                                    <div className="score-fill" style={{ width: `${pdfData.keywordMatch}%` }}></div>
                                </div>
                                <span>{pdfData.keywordMatch}%</span>
                            </div>
                            
                            <div className="score-category">
                                <h3>Formatting</h3>
                                <div className="score-bar">
                                    <div className="score-fill" style={{ width: `${pdfData.formatting}%` }}></div>
                                </div>
                                <span>{pdfData.formatting}%</span>
                            </div>
                            
                            <div className="score-category">
                                <h3>Content Quality</h3>
                                <div className="score-bar">
                                    <div className="score-fill" style={{ width: `${pdfData.contentQuality}%` }}></div>
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
                        
                        <button className="download-button">
                            Download Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}