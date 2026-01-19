import React from 'react';
import { Activity, FileEdit, FilePlus, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'update' | 'create' | 'delay' | 'complete' | 'issue';
  user: string;
  project: string;
  time: string;
  description: string;
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'update',
      user: 'Michael S.',
      project: 'Office Tower',
      time: '10 minutes ago',
      description: 'Updated project timeline to reflect new material delivery dates',
    },
    {
      id: 2,
      type: 'create',
      user: 'Jennifer L.',
      project: 'Beach Resort',
      time: '2 hours ago',
      description: 'Created new project and assigned initial team members',
    },
    {
      id: 3,
      type: 'delay',
      user: 'Robert J.',
      project: 'Shopping Mall',
      time: '4 hours ago',
      description: 'Reported delay in concrete pouring due to weather conditions',
    },
    {
      id: 4,
      type: 'complete',
      user: 'Sarah M.',
      project: 'Central Hospital',
      time: 'Yesterday',
      description: 'Marked foundation work as completed, ready for inspection',
    },
    {
      id: 5,
      type: 'issue',
      user: 'David L.',
      project: 'Residential Complex',
      time: 'Yesterday',
      description: 'Reported electrical issue in Building B, requires immediate attention',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update':
        return <FileEdit className="h-5 w-5 text-blue-500" />;
      case 'create':
        return <FilePlus className="h-5 w-5 text-green-500" />;
      case 'delay':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'issue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'update': return 'bg-blue-500/20';
      case 'create': return 'bg-emerald-500/20';
      case 'delay': return 'bg-amber-500/20';
      case 'complete': return 'bg-emerald-500/20';
      case 'issue': return 'bg-red-500/20';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-700">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-primary-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-slate-100">Recent Activity</h3>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 && <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-600" aria-hidden="true" />}
                  <div className="relative flex items-start space-x-3">
                    <div className={`relative p-1 rounded-full ${getActivityColor(activity.type)}`}>{getActivityIcon(activity.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm"><span className="font-medium text-slate-100">{activity.user}</span></div>
                      <p className="mt-0.5 text-sm text-slate-400">{activity.description} on <span className="font-medium text-slate-300">{activity.project}</span></p>
                      <div className="mt-2 text-xs text-slate-500">{activity.time}</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-center">
          <button type="button" className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;