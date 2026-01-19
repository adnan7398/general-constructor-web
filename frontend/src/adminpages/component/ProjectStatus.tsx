import React, { useState, useEffect } from 'react';
import { Building, Calendar, MapPin, HardHat, Clock, CheckCircle } from 'lucide-react';
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

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');

  const statusItems = [
    { 
      title: 'In Progress', 
      count: ongoingProjects.length, 
      color: 'bg-orange-500',
      icon: <HardHat className="h-4 w-4" />,
      projects: ongoingProjects.map(project => ({
        name: project.name,
        completion: Math.floor(Math.random() * 80) + 20, // Mock completion percentage
        location: project.location || 'Location TBD',
        deadline: project.endDate || 'TBD',
        workers: Math.floor(Math.random() * 30) + 10
      }))
    },
    { 
      title: 'Completed', 
      count: completedProjects.length, 
      color: 'bg-green-500',
      icon: <CheckCircle className="h-4 w-4" />,
      projects: completedProjects.map(project => ({
        name: project.name,
        completion: 100,
        location: project.location || 'Location TBD',
        deadline: project.endDate || 'Completed',
        workers: 0
      }))
    },
    { 
      title: 'Planning Phase', 
      count: upcomingProjects.length, 
      color: 'bg-blue-500',
      icon: <Calendar className="h-4 w-4" />,
      projects: upcomingProjects.map(project => ({
        name: project.name,
        completion: 0,
        location: project.location || 'Location TBD',
        deadline: project.startDate || 'TBD',
        workers: 0
      }))
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2].map(j => (
                    <div key={j} className="bg-white p-3 rounded border border-gray-200">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-orange-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Construction Project Overview</h3>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {statusItems.map((item) => (
            <div key={item.title} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${item.color} mr-3`}>
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                </div>
                <span className={`${item.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {item.count}
                </span>
              </div>
              <div className="space-y-4">
                {item.projects.length > 0 ? item.projects.map((project) => (
                  <div key={project.name} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{project.name}</h5>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.location}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {project.deadline}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{project.completion}%</div>
                        {project.workers > 0 && (
                          <div className="flex items-center text-xs text-gray-500">
                            <HardHat className="h-3 w-3 mr-1" />
                            {project.workers} workers
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color} transition-all duration-500`} 
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
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