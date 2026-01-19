import React, { useState, useEffect } from 'react';
import { Building, Users, HardHat, CreditCard } from 'lucide-react';
import { getAllProjects } from '../../api/projects';
import { getAllResources } from '../../api/resources';
import { getAllTeamMembers } from '../../api/teammember';

const cards = [
  { title: 'Total Projects', key: 'totalProjects' as const, icon: Building, bg: 'bg-primary-500/20', iconColor: 'text-primary-400' },
  { title: 'Active Projects', key: 'activeProjects' as const, icon: HardHat, bg: 'bg-amber-500/20', iconColor: 'text-amber-400' },
  { title: 'Team Members', key: 'totalTeamMembers' as const, icon: Users, bg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
  { title: 'Resources', key: 'totalResources' as const, icon: CreditCard, bg: 'bg-violet-500/20', iconColor: 'text-violet-400' },
];

const QuickStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTeamMembers: 0,
    totalResources: 0,
    loading: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [projects, teamMembers, resources] = await Promise.all([
          getAllProjects().catch(() => []),
          getAllTeamMembers().catch(() => []),
          getAllResources().catch(() => []),
        ]);
        const active = projects.filter((p) => p.status === 'ongoing').length;
        setStats({
          totalProjects: projects.length,
          activeProjects: active,
          totalTeamMembers: teamMembers.length,
          totalResources: resources.length,
          loading: false,
        });
      } catch (e) {
        setStats((p) => ({ ...p, loading: false }));
      }
    };
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const value = stats.loading ? '—' : stats[c.key];
        return (
          <div
            key={c.key}
            className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${c.bg}`}>
                <Icon className={`h-6 w-6 ${c.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-400">{c.title}</p>
                <p className="text-2xl font-semibold text-slate-100 mt-0.5">{value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;
