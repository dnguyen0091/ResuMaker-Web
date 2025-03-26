import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import './App.css';
import { AuthProvider } from './context/AuthContext';
// import './index.css';
import MainLayout from './layouts/MainLayout';
import NoLayout from './layouts/NoLayout';
import Credits from './pages/Credits/credits';
import HomePage from './pages/homepage/HomePage';
import ResumeAnalyzer from './pages/Resume Analyzer/resumeAnalyzer';
import ResumeBuilder from './pages/Resume Builder/resumeBuilder';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes that use the global layout */}
          <Route element={<MainLayout />}>
            {/* <Route path="/" element={<Landing />} /> */}

            {/* <Route path='/auth' element={ <AuthPage /> } /> */}

            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/credits" element={<Credits/>}/>
          </Route>

          {/* Routes without global layout */}
          <Route element={<NoLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

