import { useState } from 'react';
// import { analyzePdf } from '../../API/resumeService';
import './resumeAnalyzer.css';

export default function UploadPDF({ onUploadSuccess }) {
    const [fileName, setFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setFileName(file.name);
        
        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }
        
        setIsUploading(true);
        setError(null);
        
        // Create a URL for the file to be used for preview
        const fileUrl = URL.createObjectURL(file);
        console.log(fileUrl);
        console.log(file);
        try {
            // Call the API to analyze the PDF
            const analysisResult = await analyzePdf(file);
            console.log('Analysis result:', analysisResult);
            
            // Use default values if any expected fields are missing
            const analysisResults = {
                fileName: file.name,
                fileSize: file.size,
                uploadDate: new Date().toISOString(),
                fileUrl: fileUrl,
                score: analysisResult.overall_score || 75,
                keywordMatch: analysisResult.keyword_match || 70,
                formatting: analysisResult.formatting || 65,
                contentQuality: analysisResult.content_quality || 60,
                suggestions: analysisResult.suggestions || [
                    "Unable to generate specific suggestions",
                    "Try improving your resume's formatting and content"
                ]
            };
            
            // Call the callback with the results
            if (onUploadSuccess) {
                onUploadSuccess(analysisResults);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Error analyzing resume: ' + err.message);
            URL.revokeObjectURL(fileUrl); // Clean up the URL if there's an error
        } finally {
            setIsUploading(false);
        }
    };
    
    // Rest of the component remains the same...
    async function analyzePdf(file) {
        try {
            const API_URL = 'https://resumaker-api.onrender.com';
            const formData = new FormData();
            formData.append('file', file);
        
            console.log('Starting file upload:', file.name);
            
            const response = await fetch(`${API_URL}/api/ai/analyze`, {  // Changed endpoint path
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
              // Try to parse error response if possible
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                } catch (jsonError) {
                    // If JSON parsing fails, use status text
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }
            
            // Handle empty response
            const text = await response.text();
            console.log('Response text length:', text.length);
            
            if (!text || text.trim() === '') {
                throw new Error('Server returned an empty response');
            }
            
            // Try to parse the JSON
            try {
                const analysisData = JSON.parse(text);
                return analysisData;
                } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                console.error('Raw response:', text);
                throw new Error('Invalid response format from server');
                }
            } catch (error) {
                console.error('Error in analyzePdf:', error);
                throw error;
            }
    }
    
    return (
        <div className="upload-page-container">
            <h1>Resume Analyzer</h1>
            <div className="upload-container">
                
                <p className="upload-description">
                    Upload your resume as a PDF to analyze its effectiveness and get feedback
                </p>
                
                {error && <div className="error-message">{error}</div>}
                
                <label htmlFor="file" className="custom-file-upload">
                    <div className="icon">
                        <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                            {/* SVG path data */}
                            <g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill="currentColor"></path>
                            </g>
                        </svg>
                    </div>
                    <div className="text">
                        <span>{fileName ? fileName : "Click to upload PDF"}</span>
                    </div>
                    <input 
                        id="file" 
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
                
                {isUploading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Analyzing your resume...</p>
                    </div>
                )}
            </div>
        </div>
    );
}