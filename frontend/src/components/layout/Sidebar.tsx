import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Briefcase,
    Users,
    Layout,
    ChevronLeft,
    Quote,
    Box,
    CreditCard,
    DollarSign,
    BarChart2,
    Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const { user } = useAuth();
    let role = user?.role || 'STAFF';

    // Normalize admin role
    if (role.toLowerCase() === 'admin') {
        role = 'SUPER_ADMIN';
    }

    const navItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard', roles: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] },
        { name: 'Projects', icon: Briefcase, path: '/project', roles: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] },
        { name: 'Tasks', icon: Layout, path: '/tasks', roles: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] },
        { name: 'Team', icon: Users, path: '/team', roles: ['SUPER_ADMIN', 'MANAGER'] },
        { name: 'Resources', icon: Box, path: '/resources', roles: ['SUPER_ADMIN', 'MANAGER'] },
        { name: 'Quotes', icon: Quote, path: '/quotes', roles: ['SUPER_ADMIN', 'MANAGER'] },
    ];

    const financialItems = [
        { name: 'Site Accounts', icon: CreditCard, path: '/budgets', roles: ['SUPER_ADMIN', 'MANAGER'] },
        { name: 'Total Accounts', icon: DollarSign, path: '/totalaccount', roles: ['SUPER_ADMIN', 'MANAGER'] },
        { name: 'Reports', icon: BarChart2, path: '/reports', roles: ['SUPER_ADMIN', 'MANAGER'] },
    ];

    const showSettings = ['SUPER_ADMIN', 'MANAGER'].includes(role);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleSidebar}
            />

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200 
          transition-transform duration-300 transform lg:translate-x-0 lg:static 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="h-14 flex items-center px-4 border-b border-gray-200/50">
                    <div className="flex items-center gap-2 font-bold text-gray-900 tracking-tight">
                        <div className="w-8 h-8 bg-brand-black text-white rounded-lg flex items-center justify-center">
                            <span className="text-sm">G</span>
                        </div>
                        <span>General.co</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="ml-auto lg:hidden p-1 text-gray-500 hover:bg-gray-200 rounded-md"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="p-3 space-y-8 overflow-y-auto h-[calc(100vh-3.5rem)]">

                    {/* Main Group */}
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Platform
                        </div>
                        <div className="space-y-0.5">
                            {navItems.filter(item => item.roles.includes(role)).map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                                        }
                  `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                                            {item.name}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Financial Group */}
                    {financialItems.some(item => item.roles.includes(role)) && (
                        <div>
                            <div className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                                Financials
                            </div>
                            <div className="space-y-0.5">
                                {financialItems.filter(item => item.roles.includes(role)).map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                                                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                                            }
                  `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                                                {item.name}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Configuration Group */}
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Settings
                        </div>
                        <div className="space-y-0.5">
                            {showSettings && (
                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                                        }
                `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Settings size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                                            Settings
                                        </>
                                    )}
                                </NavLink>
                            )}

                            <NavLink
                                to="/profile"
                                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                                    }
                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Users size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                                        Profile
                                    </>
                                )}
                            </NavLink>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
