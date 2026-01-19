import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, X, Bell, TrendingUp, TrendingDown } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  projectId?: string;
  projectName?: string;
}

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate real-time alerts
    const generateMockAlerts = () => {
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Budget Overrun Alert',
          message: 'Downtown Office Complex is 15% over budget',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          priority: 'high',
          projectId: 'proj1',
          projectName: 'Downtown Office Complex'
        },
        {
          id: '2',
          type: 'error',
          title: 'Safety Incident',
          message: 'Minor equipment malfunction reported at Shopping Mall site',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          priority: 'high',
          projectId: 'proj2',
          projectName: 'Shopping Mall Expansion'
        },
        {
          id: '3',
          type: 'success',
          title: 'Project Milestone',
          message: 'Residential Tower foundation completed ahead of schedule',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          priority: 'medium',
          projectId: 'proj3',
          projectName: 'Luxury Residential Tower'
        },
        {
          id: '4',
          type: 'info',
          title: 'Resource Request',
          message: 'Additional concrete delivery scheduled for tomorrow',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          priority: 'low',
          projectId: 'proj1',
          projectName: 'Downtown Office Complex'
        },
        {
          id: '5',
          type: 'warning',
          title: 'Weather Delay',
          message: 'Heavy rain forecast may delay outdoor work',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          priority: 'medium'
        }
      ];

      setAlerts(mockAlerts);
    };

    generateMockAlerts();

    // Simulate new alerts every 30 seconds
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: ['warning', 'error', 'success', 'info'][Math.floor(Math.random() * 4)] as any,
        title: 'New Alert',
        message: 'This is a simulated real-time alert',
        timestamp: new Date(),
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 alerts
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'error': return <X className="h-5 w-5 text-red-400" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-400" />;
      default: return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-900/30 border-amber-800/50';
      case 'error': return 'bg-red-900/30 border-red-800/50';
      case 'success': return 'bg-emerald-900/30 border-emerald-800/50';
      case 'info': return 'bg-blue-900/30 border-blue-800/50';
      default: return 'bg-slate-700/50 border-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/30 text-red-300';
      case 'medium': return 'bg-amber-500/30 text-amber-300';
      case 'low': return 'bg-emerald-500/30 text-emerald-300';
      default: return 'bg-slate-600 text-slate-300';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 3);
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high').length;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-amber-400 mr-3" />
            <h3 className="text-xl font-bold text-slate-100">Real-Time Alerts</h3>
            {highPriorityCount > 0 && (
              <span className="ml-3 bg-red-500/30 text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {highPriorityCount} High Priority
              </span>
            )}
          </div>
          <button onClick={() => setShowAll(!showAll)} className="text-sm text-amber-400 hover:text-amber-300 font-medium">
            {showAll ? 'Show Less' : `Show All (${alerts.length})`}
          </button>
        </div>
      </div>
      <div className="p-6">
        {displayedAlerts.length > 0 ? (
          <div className="space-y-4">
            {displayedAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-100">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>{alert.priority}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{alert.message}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(alert.timestamp)}
                        {alert.projectName && <><span className="mx-2">•</span><span className="font-medium text-slate-400">{alert.projectName}</span></>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => dismissAlert(alert.id)} className="flex-shrink-0 ml-2 text-slate-500 hover:text-slate-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-100 mb-2">All Clear!</h3>
            <p className="text-slate-500">No active alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeAlerts;
