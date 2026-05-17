import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">₹</span>
          </div>
          <h1 className="text-2xl font-bold">FinTrack</h1>
        </div>

        <div className="flex items-center space-x-8">
          <div className="hidden sm:flex space-x-6">
            <a
              href="/dashboard"
              className="hover:text-blue-200 transition duration-200"
            >
              Dashboard
            </a>
            <a
              href="/transactions"
              className="hover:text-blue-200 transition duration-200"
            >
              Transactions
            </a>
            <a
              href="/reports"
              className="hover:text-blue-200 transition duration-200"
            >
              Reports
            </a>
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
