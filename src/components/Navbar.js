import React, { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkStyles = (path) => {
    return `text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-200 ${
      isActive(path)
        ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
    }`;
  };

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80 fixed top-0 left-0 right-0 z-50 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all duration-300">
            <span className="text-white font-extrabold text-base">₹</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors duration-250">
            FinTrack
          </h1>
        </Link>

        {/* Links & Actions */}
        <div className="flex items-center space-x-6">
          {/* Main Navigation Links */}
          <div className="hidden sm:flex space-x-2">
            <Link to="/dashboard" className={linkStyles('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/transactions" className={linkStyles('/transactions')}>
              Transactions
            </Link>
            <Link to="/reports" className={linkStyles('/reports')}>
              Reports
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-full font-medium">
                Welcome, <span className="text-indigo-300 font-semibold">{user.name || 'User'}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-slate-900 hover:bg-rose-950/30 border border-slate-850 hover:border-rose-900/50 text-slate-350 hover:text-rose-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
