import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  CheckSquare, 
  DollarSign, 
  HardHat, 
  BarChart, 
  Settings, 
  Group as TeamMember,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigationItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/' },
    { name: 'Projects', icon: <Building className="h-5 w-5" />, href: '/project' },
    { name: 'Tasks', icon: <CheckSquare className="h-5 w-5" />, href: '/tasks' },
    { name: 'Budgets', icon: <DollarSign className="h-5 w-5" />, href: '/budgets' },
    { name: 'TeamMember', icon: <TeamMember className="h-5 w-5" />, href: '/team' },
    { name: 'Resources', icon: <HardHat className="h-5 w-5" />, href: '/resources' },
    { name: 'Reports', icon: <BarChart className="h-5 w-5" />, href: '/reports' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
  ];

  return (
    <>
    
      <div
        className={`fixed inset-0 z-40 flex lg:hidden ${
          isOpen ? 'visible' : 'invisible'
        } transition-opacity duration-300 ease-linear`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 ${
            isOpen ? 'opacity-75' : 'opacity-0'
          } transition-opacity duration-300 ease-linear`}
          onClick={toggleSidebar}
        ></div>

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } transition duration-300 ease-in-out`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="font-bold text-xl text-blue-600">Divine Developer</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <div className="mr-4 text-gray-500 group-hover:text-blue-500">
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
              <span className="font-bold text-xl text-blue-600">Divine Developer</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.name === 'Dashboard'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <div
                      className={`mr-3 ${
                        item.name === 'Dashboard'
                          ? 'text-blue-500'
                          : 'text-gray-500 group-hover:text-blue-500'
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;