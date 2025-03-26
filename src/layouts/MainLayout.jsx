import { Outlet } from 'react-router-dom';
import '../App.css';
import Header from '../components/Header/header';
import NavPill from '../components/Navigation/navPill';
import '../index.css';

function MainLayout() {
  return (
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
