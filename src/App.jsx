import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import NoLayout from './layouts/NoLayout';
import Navbar from './components/Navbar';
import './App.css';
import Credits from './pages/Credits';
import HomePage from './pages/HomePage';
import Landing from './pages/landingPage';
import ResumeAnalyzer from './pages/Resume Builder/Analyzer';
import ResumeBuilder from './pages/Resume Builder/ResumeBuilder';
import AuthPage from './pages/AuthPage';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Routes that use the global layout */}
          <Route element={<MainLayout />}>
            {/* <Route path="/" element={<Landing />} /> */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />

            <Route path='/auth' element={ <AuthPage /> } />

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

