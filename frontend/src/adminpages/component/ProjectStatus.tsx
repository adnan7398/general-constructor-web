import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Circle } from 'lucide-react';
import { getAllProjects, Project } from '../../api/projects';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const ProjectStatus = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        // Get 5 most recent
        setRecentProjects(data.slice(0, 5));
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing': return 'brand';
      case 'completed': return 'success';
      case 'upcoming': return 'neutral';
      case 'delayed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
          <p className="text-sm text-gray-500">Overview of latest project activity</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/project')} rightIcon={<ArrowRight className="w-4 h-4" />}>
          View All
        </Button>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100/50 text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Project Name</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Budget</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentProjects.map((project) => (
              <tr key={project._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{project.name}</div>
                  <div className="text-xs text-gray-500">{project.client?.name || 'No Client'}</div>
                </td>
                <td className="px-6 py-4 text-gray-500 capitalize">
                  {project.projectType}
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  ${(project.budget || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(project.status || 'upcoming')}>
                    {project.status || 'Upcoming'}
                  </Badge>
                </td>
              </tr>
            ))}
            {recentProjects.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProjectStatus;
