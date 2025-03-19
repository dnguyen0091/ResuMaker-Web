import { useState } from 'react';
import Results from './results';
import UploadPDF from './uploadPDF';

export default function ResumeAnalyzer() {
    // State to track if a PDF has been uploaded
    const [pdfUploaded, setPdfUploaded] = useState(false);
    // State to store the uploaded PDF data or analysis results
    const [pdfData, setPdfData] = useState(null);
    
    // Function to handle successful PDF upload
    const handlePdfUpload = (data) => {
        // Store the uploaded PDF data
        setPdfData(data);
        // Set pdfUploaded to true to trigger page switch
        setPdfUploaded(true);
    };
    
    // Function to reset and go back to upload page
    const handleReset = () => {
        setPdfUploaded(false);
        setPdfData(null);
    };
    
    return (
        <div className="resume-analyzer-container">
            {!pdfUploaded ? (
                // Show UploadPDF component when no PDF is uploaded yet
                <UploadPDF onUploadSuccess={handlePdfUpload} />
            ) : (
                // Show Results component when PDF has been uploaded
                <Results 
                    pdfData={pdfData} 
                    onReset={handleReset} 
                />
            )}
        </div>
    );
}