
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeTab, setActiveTab, onLogout }) => {
  const isOwner = currentUser.role === UserRole.OWNER;

  const menuItems = [
    { id: 'pos', label: 'Kasir / POS', icon: '💰' },
    { id: 'history', label: 'Riwayat', icon: '📜' },
    ...(isOwner ? [
      { id: 'dashboard', label: 'Analitik', icon: '📊' },
      { id: 'menu', label: 'Menu', icon: '🍴' },
      { id: 'users', label: 'Akun', icon: '👥' },
    ] : []),
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="p-4 md:p-6 flex flex-col items-center md:items-start">
        <h1 className="text-2xl md:text-xl font-bold flex items-center gap-2 italic">
          ⚓ <span className="hidden md:inline">Warung Kapten</span>
        </h1>
        <p className="hidden md:block text-slate-400 text-[10px] mt-1 uppercase tracking-wider font-semibold">
          {isOwner ? 'Owner Dashboard' : 'Kasir System'}
        </p>
      </div>

      <nav className="flex-1 px-2 md:px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full py-4 md:py-3 md:px-4 rounded-2xl flex flex-col md:flex-row items-center gap-1 md:gap-3 transition-all touch-active ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl md:text-base">{item.icon}</span>
            <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-2 md:p-4 mt-auto border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 px-1 md:px-2 py-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-sm font-bold shadow-inner">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden md:block flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full mt-2 text-center md:text-left px-0 md:px-4 py-3 text-red-400 hover:text-red-300 text-sm font-bold flex flex-col md:flex-row items-center gap-1 md:gap-2 touch-active"
        >
          <span className="md:hidden text-lg">🚪</span>
          <span className="text-[10px] md:text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
