import { useState } from 'react';
import Results from './results';
import './resumeAnalyzer.css';
import UploadPDF from './uploadPDF';

export default function ResumeAnalyzer() {
    const [pdfData, setPdfData] = useState(null);
    
    const handlePdfUpload = (data) => {
        setPdfData(data);
    };
    
    const handleReset = () => {
        // Clean up the object URL to avoid memory leaks
        if (pdfData && pdfData.fileUrl) {
            URL.revokeObjectURL(pdfData.fileUrl);
        }
        setPdfData(null);
    };
    
    return (
        <div className="resume-analyzer">
            {!pdfData ? (
                <UploadPDF onUploadSuccess={handlePdfUpload} />
            ) : (
                <Results pdfData={pdfData} onReset={handleReset} />
            )}
        </div>
    );
}