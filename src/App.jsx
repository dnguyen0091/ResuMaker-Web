import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../index.css';
import MainLayout from '../Layouts/MainLayout';
import NoLayout from '../Layouts/NoLayout';
import './App.css';
import Credits from './Credits/credits';
import HomePage from './homepage/HomePage';
import Landing from './landing/landing';
import ResumeAnalyzer from './Resume Analyzer/resumeAnalyzer';
import ResumeBuilder from './Resume Builder/resumeBuilder';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that use the global layout */}
        <Route element={<MainLayout />}>
          {/* <Route path="/" element={<Landing />} /> */}
          <Route path="/landing" element={<Landing />} />
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
  );
}

// function App() {
//   return (
//     <Router>
//       {/* Outer container to ensure full width */}
//       <div className="app-container">
//         {/* Header with no extra margins */}
//         <Header />
        
//         {/* Content area */}
//         <div className="content-container">
//           {/* NavPill centered */}
//           <div className="nav-pill-wrapper">
//             <NavPill />
//           </div>
          
//           {/* Main content area */}
//           <main className="page-content">
//             <Routes>
//               <Route path="/" element={<Landing />} />
//               <Route path="/resume-builder" element={<ResumeBuilder />} />
//               <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

