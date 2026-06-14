import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">₹</span>
          </div>
          <h1 className="text-2xl font-bold">FinTrack</h1>
        </Link>

        <div className="flex items-center space-x-8">
          <div className="hidden sm:flex space-x-6">
            <Link
              to="/dashboard"
              className="hover:text-blue-200 transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="hover:text-blue-200 transition duration-200"
            >
              Transactions
            </Link>
            <Link
              to="/reports"
              className="hover:text-blue-200 transition duration-200"
            >
              Reports
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-blue-100">
                Welcome, {user.name || 'User'}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition duration-200"
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
