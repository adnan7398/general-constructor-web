import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, RefreshCw, Clock, Plus } from 'lucide-react';
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
import Button from '../../components/ui/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalResources: 0,
    totalTeamMembers: 0,
    loading: true,
    lastUpdated: new Date(),
  });

  const loadDashboardData = async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true }));
      const [projects, resources, teamMembers] = await Promise.all([
        getAllProjects().catch(() => []),
        getAllResources().catch(() => []),
        getAllTeamMembers().catch(() => []),
      ]);
      const activeProjects = projects.filter((p) => p.status === 'ongoing').length;
      const completedProjects = projects.filter((p) => p.status === 'completed').length;
      setDashboardData({
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalResources: resources.length,
        totalTeamMembers: teamMembers.length,
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Overview</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {dashboardData.lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadDashboardData}
            isLoading={dashboardData.loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${dashboardData.loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/profile')}
            leftIcon={<User className="w-3.5 h-3.5" />}
          >
            Profile
          </Button>
          {/* Create Project Button Wrapper to match style if possible, or keep as is */}
          <div className="inline-block">
            <CreateProjectButton />
          </div>
        </div>
      </div>

      <RealTimeAlerts />

      {/* Stats Grid */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ProjectStatus />
          <AnalyticsDashboard />
          <BudgetUtilization />
        </div>

        <div className="space-y-6">
          <TaskOverview />
          <RecentActivity />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
