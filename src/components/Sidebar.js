import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Transactions', icon: '💳', path: '/transactions' },
    { name: 'Reports', icon: '📈', path: '/reports' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed left-0 top-16 bottom-0 bg-slate-950/80 backdrop-blur-md border-r border-slate-900/80 text-white transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      } overflow-hidden flex flex-col justify-between`}
    >
      <div>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full py-4 text-center hover:bg-slate-900/50 text-slate-400 hover:text-slate-200 border-b border-slate-900/40 transition duration-200 cursor-pointer flex items-center justify-center font-bold text-xs"
        >
          {isCollapsed ? '▶' : '◀ COLLAPSE'}
        </button>

        {/* Menu Items */}
        <div className="mt-6 space-y-1.5 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-indigo-650/10 text-indigo-300 border border-indigo-500/20 shadow-[inset_0_0_12px_rgba(99,102,241,0.05)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/45 border border-transparent'
                }`}
              >
                {/* Active marker left line */}
                {active && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-550 rounded-r-md" />
                )}
                
                <span className="text-xl w-7 text-center group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="font-semibold text-sm tracking-wide transition-all duration-250">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Optional footer credit or logo */}
      {!isCollapsed && (
        <div className="p-4 text-center border-t border-slate-900/40">
          <p className="text-3xs text-slate-500 uppercase tracking-widest font-semibold">
            FinTrack v1.1
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
