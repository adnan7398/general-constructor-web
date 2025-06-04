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
      case 'alert':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'info':
        return 'bg-blue-50 border-blue-100';
      case 'success':
        return 'bg-green-50 border-green-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Alerts & Notifications</h3>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Mark all as read
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${getBgColor(notification.type)} flex items-start`}
            >
              <div className="flex-shrink-0 mr-3">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
              <button className="ml-2 flex-shrink-0 h-5 w-5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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