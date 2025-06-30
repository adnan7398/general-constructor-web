import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, Search, Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-blue-600 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 flex lg:ml-0">
              <div className="flex items-center">
                <span className="font-bold text-xl text-blue-600"></span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="relative p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                <Bell className="h-6 w-6" />
              </button>

              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Notifications</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="block px-4 py-3 hover:bg-gray-50 transition ease-in-out duration-150"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                              <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">New task assigned</p>
                              <p className="mt-1 text-sm text-gray-500">
                                You have been assigned to the project "Office Tower".
                              </p>
                              <p className="mt-1 text-xs text-gray-400">10 minutes ago</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 px-4 py-2">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        <span>Your Profile</span>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Sign out</span>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;