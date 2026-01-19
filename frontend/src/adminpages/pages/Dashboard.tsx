import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { User, RefreshCw, Clock } from 'lucide-react';
import QuickStats from '../component/QuickStats';
import ProjectStatus from '../component/ProjectStatus';
import TaskOverview from '../component/TaskOverview';
import BudgetUtilization from '../component/BudgetUtilization';
import RecentActivity from '../component/RecentActivity';
import Notifications from '../component/Notifications';
import CreateProjectButton from '../component/CreateProjectButton';
import RealTimeAlerts from '../component/RealTimeAlerts';
import AnalyticsDashboard from '../component/AnalyticsDashboard';
import { getAllProjects } from '../../api/projects';
import { getAllResources } from '../../api/resources';
import { getAllTeamMembers } from '../../api/teammember';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State for real-time data
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalResources: 0,
    totalTeamMembers: 0,
    loading: true,
    lastUpdated: new Date()
  });

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Load all data in parallel
      const [projects, resources, teamMembers] = await Promise.all([
        getAllProjects().catch(() => []),
        getAllResources().catch(() => []),
        getAllTeamMembers().catch(() => [])
      ]);

      const activeProjects = projects.filter(p => p.status === 'ongoing').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;

      setDashboardData({
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalResources: resources.length,
        totalTeamMembers: teamMembers.length,
        loading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Construction Management Dashboard</h1>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: {dashboardData.lastUpdated.toLocaleTimeString()}
            {dashboardData.loading && (
              <RefreshCw className="w-4 h-4 ml-2 animate-spin text-orange-500" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadDashboardData}
            disabled={dashboardData.loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${dashboardData.loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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

      <div className="space-y-8">
        {/* Real-time alerts at the top */}
        <RealTimeAlerts />
        
        {/* Quick stats */}
        <QuickStats />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left column - Project Status */}
          <div className="xl:col-span-2">
            <ProjectStatus />
          </div>
          
          {/* Right column - Task Overview */}
          <div>
            <TaskOverview />
          </div>
        </div>
        
        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
        
        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BudgetUtilization />
          <div className="space-y-6">
            <RecentActivity />
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;