import { Outlet } from 'react-router-dom';
import Header from '../Components/Header/header';
import NavPill from '../Components/Navigation/navPill';
import '../index.css';
import '../Pages/App.css';

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
