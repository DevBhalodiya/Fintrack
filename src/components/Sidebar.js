import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Add Transaction', icon: '➕', path: '/transactions' },
    { name: 'Reports', icon: '📈', path: '/reports' },
  ];

  return (
    <div
      className={`fixed left-0 top-16 bottom-0 bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } overflow-hidden shadow-lg`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 text-center hover:bg-gray-800 transition duration-200"
      >
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* Menu Items */}
      <div className="mt-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-4 px-4 py-3 hover:bg-gray-800 transition duration-200 text-gray-100"
          >
            <span className="text-2xl w-8 text-center">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
