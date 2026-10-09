import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      onLogin(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow py-12 px-4">
      <div className="bg-bmsCard p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-black text-center text-bmsRed mb-6">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-bmsRed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-bmsRed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-bmsRed"
            />
          </div>
          <button type="submit" className="w-full bg-bmsRed hover:bg-red-700 py-3 rounded-lg font-bold text-sm transition">
            Sign Up
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-bmsRed font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}