import React from 'react';
import { Search, Film, Ticket, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
    // If typing from another page, jump back to Home to see results
    if (window.location.pathname !== '/') {
      navigate(`/?search=${query}`);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2 text-white font-black text-xl">
        <Film className="w-6 h-6 text-red-600" />
        <span>Dpcoe <span className="text-red-600">Cinema</span></span>
      </Link>

      {/* Navbar Search Input */}
      <div className="relative max-w-md w-full mx-6 hidden sm:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </span>
        <input 
          type="text"
          placeholder="Search movies by title or genre..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
        />
      </div>
      <Link to="/filter" className="hover:text-red-500 transition text-sm font-bold">Filter</Link>

      <div className="flex items-center space-x-4">
        <Link to="/bookings" className="flex items-center space-x-1.5 text-gray-300 hover:text-white text-sm font-bold transition">
          <Ticket className="w-4 h-4 text-red-600" />
          <span>My Bookings</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-3 pl-2 border-l border-gray-800">
            <span className="text-xs text-gray-400 hidden md:inline">Hello, <strong className="text-white">{user.name || user.email}</strong></span>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-1 text-gray-400 hover:text-red-500 text-sm font-bold transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
            <Link 
              to="/login" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white text-sm font-bold px-3 py-1.5 rounded-lg transition"
            >
              <LogIn className="w-4 h-4 text-red-600" />
              <span>Login</span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3.5 py-1.5 rounded-lg transition shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}