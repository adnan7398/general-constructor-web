import React, { useState, useEffect } from 'react';
import { Building, Check, Clock, Search } from 'lucide-react';
import Layout from '../layout';
import {
  Project,
  getPendingProjects,
  getCompletedProjects,
  completeProject,
} from '../../api/projectsapi';
import CreateProjectButton from '../component/CreateProjectButton';

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [team, setTeam] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  useEffect(()=>{
    const fetchTeam = async () => {
      try {
        const teamData = await getPendingProjects();
        setTeam(teamData.map(member => member.name || 'Unnamed'));
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    fetchTeam();
  })

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data =
        activeTab === 'pending'
          ? await getPendingProjects()
          : await getCompletedProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProject = async (id: string) => {
    try {
      await completeProject(id);
      await loadProjects();
    } catch (error) {
      console.error('Error completing project:', error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <CreateProjectButton />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'pending'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Pending</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'completed'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Completed</span>
                  </div>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-sm text-gray-500">
                                {project.description}
                              </div>
                            )}
                            {project.team && (
                                <div className="text-sm text-gray-500">
                                {team?.map((member) => member || 'Unnamed').join(', ')}
                                </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {project.projectType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.budget ? formatCurrency(project.budget) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {activeTab === 'pending' && (
                          <button
                            onClick={() => handleCompleteProject(project._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
