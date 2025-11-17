
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Homepage from './pages/home-page.jsx';
import AuthPage from './pages/auth-page.jsx';
import FAQ from './pages/faq-page.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </>
  );
}

export default App;
