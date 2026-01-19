import React, { useState } from 'react';
import { useAppearance } from '../contexts/AppearanceContext';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { settings: appearanceSettings } = useAppearance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`flex h-screen bg-slate-900 ${appearanceSettings.compactMode ? 'compact' : ''}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;