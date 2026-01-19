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
import PageHeader from '../component/PageHeader';
import { getAllProjects } from '../../api/projects';
import { getAllResources } from '../../api/resources';
import { getAllTeamMembers } from '../../api/teammember';

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
    <div className="max-w-[1600px]">
      <PageHeader
        title="Dashboard"
        subtitle={
          <span className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            Last updated: {dashboardData.lastUpdated.toLocaleTimeString()}
            {dashboardData.loading && (
              <RefreshCw className="h-4 w-4 animate-spin text-primary-400" />
            )}
          </span>
        }
      >
        <button
          onClick={loadDashboardData}
          disabled={dashboardData.loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${dashboardData.loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          <User className="h-4 w-4" />
          Profile
        </button>
        <CreateProjectButton />
      </PageHeader>

      <div className="space-y-6">
        <RealTimeAlerts />
        <QuickStats />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ProjectStatus />
          </div>
          <div>
            <TaskOverview />
          </div>
        </div>
        <AnalyticsDashboard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
