
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/design-system.css';
import Header from './components/Header';
import Homepage from './pages/home-page.jsx';
import AuthPage from './pages/auth-page.jsx';
import FAQ from './pages/faq-page.jsx';
import RestaurantPage from './pages/restaurant-page.jsx';
import RestaurantDetailPage from './pages/restaurant-detail-page.jsx';

function App() {
  const location = useLocation();

  // Show auth modal if URL path is /auth
  const isAuthPath = location.pathname === '/auth';

  // Determine which page to show (use state from location or default to home)
  const previousPath = location.state?.previousPath || '/';

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth" element={null} />
      </Routes>
      
      {/* Auth Modal Overlay - renders on top of current content */}
      {isAuthPath && (
        <AuthPage onClose={() => {
          window.history.back();
        }} />
      )}
    </>
  );
}

export default App;
