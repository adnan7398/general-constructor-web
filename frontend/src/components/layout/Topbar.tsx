import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="h-14 bg-white/50 backdrop-blur-md border-b border-gray-200 flex items-center px-4 sticky top-0 z-30">
      <button
        onClick={toggleSidebar}
        className="mr-3 p-1 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center text-sm">
        <span className="text-gray-400 flex items-center">
          <span className="px-1 text-lg">/</span>
        </span>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <div key={name} className="flex items-center">
              <Link
                to={routeTo}
                className={`capitalize hover:text-gray-900 transition-colors ${isLast ? 'font-medium text-gray-900' : 'text-gray-500'}`}
              >
                {name}
              </Link>
              {!isLast && <span className="text-gray-400 mx-1">/</span>}
            </div>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Search Bar Visual Only */}
        <div className="hidden md:flex items-center px-3 py-1.5 bg-gray-100/50 border border-gray-200 rounded-md text-sm text-gray-500 w-64 hover:bg-white hover:border-gray-300 transition-all cursor-text group">
          <Search size={14} className="mr-2 text-gray-400 group-hover:text-gray-600" />
          <span>Search...</span>
          <span className="ml-auto text-xs text-gray-400 border border-gray-200 rounded px-1">⌘K</span>
        </div>

        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 border border-gray-100"></div>
      </div>
    </header >
  );
};

export default Topbar;
