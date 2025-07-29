import React from 'react';
import QuickStats from '../component/QuickStats';
import ProjectStatus from '../component/ProjectStatus';
import TaskOverview from '../component/TaskOverview';
import BudgetUtilization from '../component/BudgetUtilization';
import RecentActivity from '../component/RecentActivity';
import Notifications from '../component/Notifications';
import CreateProjectButton from '../component/CreateProjectButton';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <CreateProjectButton />
      </div>

      <div className="space-y-6">
        <QuickStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectStatus />
          <TaskOverview />
        </div>
        
        <BudgetUtilization />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;