import React, { useState, useEffect } from 'react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Building, Users, Clock, CreditCard, HardHat, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { getAllProjects } from '../../api/projects';
import { getAllResources } from '../../api/resources';
import { getAllTeamMembers } from '../../api/teammember';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => {
  const { settings: appearanceSettings } = useAppearance();
  return (
    <div className="rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-blue-50">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900">{value}</h3>
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1.5">from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTeamMembers: 0,
    totalResources: 0,
    loading: true
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, teamMembers, resources] = await Promise.all([
          getAllProjects().catch(() => []),
          getAllTeamMembers().catch(() => []),
          getAllResources().catch(() => [])
        ]);

        const activeProjects = projects.filter(p => p.status === 'ongoing').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;

        setStats({
          totalProjects: projects.length,
          activeProjects,
          totalTeamMembers: teamMembers.length,
          totalResources: resources.length,
          loading: false
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
  }, []);

  const statsData = [
    {
      title: 'Total Projects',
      value: stats.loading ? '...' : stats.totalProjects,
      icon: <Building className="h-6 w-6 text-orange-600" />,
      change: {
        value: 12,
        isPositive: true,
      },
    },
    {
      title: 'Active Projects',
      value: stats.loading ? '...' : stats.activeProjects,
      icon: <HardHat className="h-6 w-6 text-blue-600" />,
      change: {
        value: 8,
        isPositive: true,
      },
    },
    {
      title: 'Team Members',
      value: stats.loading ? '...' : stats.totalTeamMembers,
      icon: <Users className="h-6 w-6 text-green-600" />,
      change: {
        value: 5,
        isPositive: true,
      },
    },
    {
      title: 'Resources',
      value: stats.loading ? '...' : stats.totalResources,
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      change: {
        value: 15,
        isPositive: true,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default QuickStats;