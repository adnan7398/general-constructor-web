import React, { useEffect, useState } from 'react';
import { Briefcase, Users, Box, Activity } from 'lucide-react';
import { getAllProjects } from '../../api/projects';
import { getAllResources } from '../../api/resources';
import { getAllTeamMembers } from '../../api/teammember';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const QuickStats = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, active: 0, growth: 12 },
    team: { total: 0, growth: 5 },
    resources: { total: 0, available: 0, growth: -2 },
    budget: { total: 0, spent: 0, growth: 8 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, resources, team] = await Promise.all([
          getAllProjects().catch(() => []),
          getAllResources().catch(() => []),
          getAllTeamMembers().catch(() => [])
        ]);

        setStats(prev => ({
          ...prev,
          projects: { ...prev.projects, total: projects.length, active: projects.filter(p => p.status === 'ongoing').length },
          team: { ...prev.team, total: team.length },
          resources: { ...prev.resources, total: resources.length, available: resources.filter(r => r.status === 'Available').length },
          budget: { ...prev.budget, total: projects.reduce((acc, p) => acc + (p.budget || 0), 0) }
        }));
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchData();
  }, []);

  const statItems = [
    {
      title: 'Active Projects',
      value: stats.projects.active,
      total: stats.projects.total,
      icon: Briefcase,
      trend: stats.projects.growth,
      label: 'Projects'
    },
    {
      title: 'Total Budget',
      value: `$${(stats.budget.total / 1000).toFixed(1)}k`,
      subtitle: 'Allocated',
      icon: Activity,
      trend: stats.budget.growth,
      label: 'vs last month'
    },
    {
      title: 'Resources',
      value: stats.resources.available,
      total: stats.resources.total,
      icon: Box,
      trend: stats.resources.growth,
      label: 'Available'
    },
    {
      title: 'Team Members',
      value: stats.team.total,
      subtitle: 'Active',
      icon: Users,
      trend: stats.team.growth,
      label: 'Members'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="relative overflow-hidden group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
              <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
            </div>
            {item.trend !== 0 && (
              <Badge variant={item.trend > 0 ? 'success' : 'error'} size="sm">
                {item.trend > 0 ? '+' : ''}{item.trend}%
              </Badge>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold text-gray-900 tracking-tight">
                {item.value}
              </span>
              {(item.total !== undefined || item.subtitle) && (
                <span className="text-sm text-gray-400">
                  {item.total ? `/ ${item.total}` : item.subtitle}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
