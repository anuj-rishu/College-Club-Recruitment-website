import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import AdminLogin from './components/AdminLogin';
import { useState } from 'react';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={loggedIn} onLogout={handleLogout} />

        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route
            path="/admin"
            element={loggedIn ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/" element={<HeroSection />} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
