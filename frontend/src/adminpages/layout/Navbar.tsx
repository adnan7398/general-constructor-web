import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, User, LogOut, Search, Menu, Sun, Moon } from 'lucide-react';
import { useAppearance } from '../../contexts/AppearanceContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAppearance();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (profileRef.current && !profileRef.current.contains(e.target as Node)) &&
        (notifRef.current && !notifRef.current.contains(e.target as Node))
      ) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
    updateSettings({ theme: next });
  };

  const handleSignOut = () => {
    setShowProfileMenu(false);
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <header className="h-14 flex-shrink-0 bg-slate-900 border-b border-slate-800">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block w-56 max-w-[40vw]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
              className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-800 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-semibold text-slate-100">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0"
                    >
                      <p className="text-sm font-medium text-slate-200">New task assigned</p>
                      <p className="text-xs text-slate-400 mt-0.5">You were assigned to &quot;Office Tower&quot;.</p>
                      <p className="text-xs text-slate-500 mt-1">10m ago</p>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-700">
                  <Link
                    to="/dashboard"
                    onClick={() => setShowNotifications(false)}
                    className="text-sm font-medium text-primary-400 hover:text-primary-300"
                  >
                    View all
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="flex items-center p-1.5 rounded-lg hover:bg-slate-800"
            >
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-800 shadow-xl z-50 py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  Settings
                </Link>
                <div className="my-1 border-t border-slate-700" />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 text-left"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
