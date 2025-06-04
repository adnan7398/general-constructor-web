import React from 'react';
import { Building } from 'lucide-react';

const ProjectStatus: React.FC = () => {
  const statusItems = [
    { 
      title: 'Ongoing', 
      count: 7, 
      color: 'bg-blue-500', 
      projects: [
        { name: 'Office Tower', completion: 65 },
        { name: 'Shopping Mall', completion: 42 },
        { name: 'Residential Complex', completion: 28 }
      ] 
    },
    { 
      title: 'Completed', 
      count: 12, 
      color: 'bg-green-500',
      projects: [
        { name: 'Central Hospital', completion: 100 },
        { name: 'Public Library', completion: 100 }
      ]
    },
    { 
      title: 'Upcoming', 
      count: 4, 
      color: 'bg-amber-500',
      projects: [
        { name: 'Beach Resort', completion: 0 },
        { name: 'Tech Campus', completion: 0 }
      ]
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
        <div className="flex items-center">
          <Building className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Project Status Summary</h3>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusItems.map((item) => (
            <div key={item.title} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-500">{item.title}</h4>
                <span className={`${item.color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                  {item.count}
                </span>
              </div>
              <div className="space-y-3">
                {item.projects.map((project) => (
                  <div key={project.name} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-xs text-gray-500">{project.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${item.color}`} 
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;