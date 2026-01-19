import React from 'react';
import { AlertTriangle, Bell, CheckCircle, Info } from 'lucide-react';

interface Notification {
  id: number;
  type: 'alert' | 'warning' | 'info' | 'success';
  message: string;
  time: string;
}

const Notifications: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: 'alert',
      message: 'Budget exceeded for Shopping Mall project by 5%',
      time: '10 minutes ago',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Concrete delivery for Office Tower delayed by 2 days',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'info',
      message: 'Safety inspection scheduled for Residential Complex tomorrow',
      time: '2 hours ago',
    },
    {
      id: 4,
      type: 'success',
      message: 'Electrical wiring inspection passed for Central Hospital',
      time: '3 hours ago',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-900/30 border-red-800/50';
      case 'warning': return 'bg-amber-900/30 border-amber-800/50';
      case 'info': return 'bg-blue-900/30 border-blue-800/50';
      case 'success': return 'bg-emerald-900/30 border-emerald-800/50';
      default: return 'bg-slate-700/50 border-slate-600';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-slate-100">Alerts & Notifications</h3>
          </div>
          <button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-slate-600 text-xs font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600">
            Mark all as read
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-3 rounded-lg border ${getBgColor(notification.type)} flex items-start`}>
              <div className="flex-shrink-0 mr-3">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">{notification.message}</p>
                <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
              </div>
              <button className="ml-2 flex-shrink-0 h-5 w-5 text-slate-500 hover:text-slate-400">
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;