import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  DollarSign,
  HardHat,
  BarChart,
  Settings,
  Users,
  Mail,
  User,
  X,
  ChevronRight,
  Wallet,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navMain = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
];

const navManagement = [
  { name: 'Projects', icon: Building, href: '/project' },
  { name: 'Team Members', icon: Users, href: '/team' },
  { name: 'Resources', icon: HardHat, href: '/resources' },
  { name: 'Quotes', icon: Mail, href: '/quotes' },
];

const navFinance = [
  { name: 'Budgets', icon: DollarSign, href: '/budgets' },
  { name: 'Total Account', icon: Wallet, href: '/totalaccount' },
];

const navAccount = [
  { name: 'Reports', icon: BarChart, href: '/reports' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

const NavGroup = ({
  label,
  items,
  location,
}: {
  label: string;
  items: { name: string; icon: React.ElementType; href: string }[];
  location: ReturnType<typeof useLocation>;
}) => (
  <div className="mb-6">
    <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </p>
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        return (
          <li key={item.name}>
            <Link
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-4 w-4 opacity-80" />}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-3 px-4 h-16 flex-shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
            <Building className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-100 truncate">Divine Developer</span>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white flex-shrink-0"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <NavGroup label="Overview" items={navMain} location={location} />
        <NavGroup label="Management" items={navManagement} location={location} />
        <NavGroup label="Finance" items={navFinance} location={location} />
        <NavGroup label="Account" items={navAccount} location={location} />
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-200 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
        <div
          className={`absolute top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl transition-transform duration-200 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:flex-col w-64 bg-slate-900 border-r border-slate-800">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
