import Builder from './builder';
import ChatTab from './chatTab';
import './resumeBuilder.css';

export default function ResumeBuilder() {
    
    return (
        <div className="resume-builder-container">
            <h1 className="builder-title">Resume Builder</h1>
            <ChatTab/>
            <Builder/>
            
        </div>
    );
}