import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import QuickStats from '../component/QuickStats';
import ProjectStatus from '../component/ProjectStatus';
import TaskOverview from '../component/TaskOverview';
import BudgetUtilization from '../component/BudgetUtilization';
import RecentActivity from '../component/RecentActivity';
import Notifications from '../component/Notifications';
import CreateProjectButton from '../component/CreateProjectButton';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <CreateProjectButton />
        </div>
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