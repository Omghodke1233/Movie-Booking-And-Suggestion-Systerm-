import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeatBooking from './pages/SeatBooking';
import MyBookings from './pages/MyBookings';
import Filter from './pages/filter';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('dpcoe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('dpcoe_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dpcoe_user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-bmsDark text-white flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route 
              path="/book/:id" 
              element={user ? <SeatBooking user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/my-bookings" 
              element={user ? <MyBookings user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="/filter" element={<Filter />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;