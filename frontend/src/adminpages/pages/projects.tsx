import React, { useState, useEffect, useRef } from 'react';
import { Building, Check, Clock, Search, Globe, Upload, Trash2, Eye, EyeOff, Image as ImageIcon, X, GripVertical } from 'lucide-react';
import {
  Project,
  getPendingProjects,
  getCompletedProjects,
  completeProject,
  getAllProjects,
  toggleShowcase,
  uploadProjectImage,
  updateProject,
  deleteProject,
} from '../../api/projects';
import CreateProjectButton from '../component/CreateProjectButton';
import PageHeader from '../component/PageHeader';

const API_BASE = 'https://general-constructor-web-2.onrender.com';

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'showcase'>('pending');
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjects();
    loadAllProjects();
  }, [activeTab]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = activeTab === 'pending' ? await getPendingProjects() : activeTab === 'completed' ? await getCompletedProjects() : [];
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllProjects = async () => {
    try {
      const data = await getAllProjects();
      setAllProjects(data);
    } catch (error) {
      console.error('Error loading all projects:', error);
    }
  };

  const handleCompleteProject = async (id: string) => {
    try {
      await completeProject(id);
      await loadProjects();
      await loadAllProjects();
    } catch (error) {
      console.error('Error completing project:', error);
    }
  };

  const handleToggleShowcase = async (id: string) => {
    try {
      await toggleShowcase(id);
      await loadAllProjects();
    } catch (error) {
      console.error('Error toggling showcase:', error);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      await uploadProjectImage(id, file);
      await loadAllProjects();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingId(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      await loadProjects();
      await loadAllProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUpdateProject = async (id: string, data: Partial<Project>) => {
    try {
      await updateProject(id, data);
      await loadAllProjects();
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showcaseProjects = allProjects.filter((p) => p.showOnWebsite).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const availableForShowcase = allProjects.filter((p) => !p.showOnWebsite);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const getImageUrl = (img?: string) => {
    if (!img || img.includes('via.placeholder.com')) return 'https://placehold.co/300x200/1e293b/94a3b8?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  return (
    <div className="max-w-[1600px] space-y-6">
      <PageHeader title="Projects" subtitle="View and manage construction projects.">
        <CreateProjectButton />
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('pending')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
        >
          <Clock className="h-4 w-4" /> Pending
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'completed' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
        >
          <Check className="h-4 w-4" /> Completed
        </button>
        <button
          onClick={() => setActiveTab('showcase')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'showcase' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
        >
          <Globe className="h-4 w-4" /> Website Showcase
        </button>
      </div>

      {/* Showcase Tab */}
      {activeTab === 'showcase' ? (
        <div className="space-y-6">
          {/* Current showcase projects */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Globe className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Projects on Website</h2>
                  <p className="text-sm text-slate-400">These projects are visible to clients on your landing page</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              {showcaseProjects.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No projects added to website showcase yet</p>
                  <p className="text-sm mt-1">Add projects from the list below</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {showcaseProjects.map((project) => (
                    <div key={project._id} className="bg-slate-700/50 rounded-xl border border-slate-600 overflow-hidden group">
                      <div className="relative aspect-video bg-slate-800">
                        <img src={getImageUrl(project.image)} alt={project.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="p-2 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700" title="Upload image">
                            <Upload className="h-5 w-5 text-slate-300" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(project._id, file);
                              }}
                            />
                          </label>
                          <button onClick={() => handleToggleShowcase(project._id)} className="p-2 bg-red-600 rounded-lg hover:bg-red-700" title="Remove from showcase">
                            <EyeOff className="h-5 w-5 text-white" />
                          </button>
                        </div>
                        {uploadingId === project._id && (
                          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                            <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-emerald-500 text-white">Live</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-100 truncate">{project.name}</h3>
                        <p className="text-sm text-slate-400 truncate mt-1">{project.description || 'No description'}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-300">{project.projectType}</span>
                          <button onClick={() => setEditingProject(project)} className="text-xs text-primary-400 hover:text-primary-300">
                            Edit Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available projects to add */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-100">Add Projects to Website</h2>
              <p className="text-sm text-slate-400 mt-1">Select projects to display on your public website</p>
            </div>
            <div className="p-5">
              {availableForShowcase.length === 0 ? (
                <p className="text-center py-8 text-slate-500">All projects are already on the website</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {availableForShowcase.map((project) => (
                    <div key={project._id} className="bg-slate-700/30 rounded-xl border border-slate-600 p-4 hover:border-slate-500 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                          <img src={getImageUrl(project.image)} alt={project.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-200 truncate">{project.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{project.projectType}</p>
                          <p className="text-xs text-slate-500 mt-1">{project.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleShowcase(project._id)}
                        className="mt-3 w-full py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" /> Add to Website
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Pending/Completed Tab */
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-700">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">Loading projects...</td></tr>
                ) : filteredProjects.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No projects found</td></tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-700/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                            <img src={getImageUrl(project.image)} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100">{project.name}</p>
                            {project.description && <p className="text-xs text-slate-400 truncate max-w-[200px]">{project.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-md bg-slate-600 text-slate-200">{project.projectType || 'N/A'}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{project.budget ? formatCurrency(project.budget) : 'N/A'}</td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => handleToggleShowcase(project._id)} className={`p-1.5 rounded-lg ${project.showOnWebsite ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'}`}>
                          {project.showOnWebsite ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {activeTab === 'pending' && (
                          <button onClick={() => handleCompleteProject(project._id)} className="text-sm font-medium text-primary-400 hover:text-primary-300">
                            Complete
                          </button>
                        )}
                        <button onClick={() => handleDeleteProject(project._id)} className="text-sm font-medium text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-100">Edit Project</h3>
              <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Type</label>
                  <select
                    value={editingProject.projectType}
                    onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value as Project['projectType'] })}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingProject.displayOrder || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={editingProject.location || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-700 flex justify-end gap-3">
              <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProject(editingProject._id, editingProject)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
