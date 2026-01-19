import React, { useState, useEffect } from 'react';
import { Building, Calendar, MapPin, HardHat, CheckCircle } from 'lucide-react';
import { getAllProjects, Project } from '../../api/projects';

const ProjectStatus: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const ongoingProjects = projects.filter((p) => p.status === 'ongoing');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const upcomingProjects = projects.filter((p) => p.status === 'upcoming');

  const statusItems = [
    { title: 'In Progress', count: ongoingProjects.length, color: 'bg-amber-500', icon: <HardHat className="h-4 w-4" />, projects: ongoingProjects.map((p) => ({ name: p.name, completion: Math.floor(Math.random() * 80) + 20, location: p.location || 'TBD', deadline: p.endDate || 'TBD', workers: Math.floor(Math.random() * 30) + 10 })) },
    { title: 'Completed', count: completedProjects.length, color: 'bg-emerald-500', icon: <CheckCircle className="h-4 w-4" />, projects: completedProjects.map((p) => ({ name: p.name, completion: 100, location: p.location || 'TBD', deadline: p.endDate || 'Completed', workers: 0 })) },
    { title: 'Planning Phase', count: upcomingProjects.length, color: 'bg-blue-500', icon: <Calendar className="h-4 w-4" />, projects: upcomingProjects.map((p) => ({ name: p.name, completion: 0, location: p.location || 'TBD', deadline: p.startDate || 'TBD', workers: 0 })) },
  ];

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-600 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700/50 p-4 rounded-xl">
                <div className="h-4 bg-slate-600 rounded w-1/2 mb-4" />
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="bg-slate-700 p-3 rounded-lg">
                      <div className="h-3 bg-slate-600 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-slate-600 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-500/20">
            <Building className="h-5 w-5 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Project Overview</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {statusItems.map((item) => (
            <div key={item.title} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${item.color} mr-3`}>{item.icon}</div>
                  <h4 className="text-lg font-semibold text-slate-200">{item.title}</h4>
                </div>
                <span className={`${item.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>{item.count}</span>
              </div>
              <div className="space-y-4">
                {item.projects.length > 0 ? (
                  item.projects.map((project) => (
                    <div key={project.name} className="bg-slate-800 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-slate-100 mb-1">{project.name}</h5>
                          <div className="flex items-center text-xs text-slate-400 mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {project.location}
                          </div>
                          <div className="flex items-center text-xs text-slate-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {String(project.deadline)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-100">{project.completion}%</div>
                          {project.workers > 0 && (
                            <div className="flex items-center text-xs text-slate-400">
                              <HardHat className="h-3 w-3 mr-1" />
                              {project.workers} workers
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${project.completion}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No {item.title.toLowerCase()} projects</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
