import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from '../Components/Header/header';
import NavPill from '../Components/Navigation/navPill';
import '../index.css';
import './App.css';
import Landing from './landing/landing';
import ResumeAnalyzer from './Resume Analyzer/resumeAnalyzer';
import ResumeBuilder from './Resume Builder/resumeBuilder';

function App() {
  return (
    <Router>
      {/* Outer container to ensure full width */}
      <div className="app-container">
        {/* Header with no extra margins */}
        <Header />
        
        {/* Content area */}
        <div className="content-container">
          {/* NavPill centered */}
          <div className="nav-pill-wrapper">
            <NavPill />
          </div>
          
          {/* Main content area */}
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;