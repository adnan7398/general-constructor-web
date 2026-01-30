import React, { useState, useEffect } from 'react';
import { Clock, Check, Globe, Search, Upload, EyeOff, X, MapPin, Filter, Plus } from 'lucide-react';
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
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const API_BASE = 'https://general-constructor-web-2.onrender.com';

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'showcase'>('pending');
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Load data
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

  useEffect(() => {
    loadProjects();
    loadAllProjects();
  }, [activeTab]);

  // Handlers
  const handleCompleteProject = async (id: string) => {
    if (!confirm('Mark project as completed?')) return;
    await completeProject(id);
    loadProjects();
    loadAllProjects();
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    await deleteProject(id);
    loadProjects();
    loadAllProjects();
  };

  const handleToggleShowcase = async (id: string) => {
    await toggleShowcase(id);
    loadAllProjects();
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      await uploadProjectImage(id, file);
      await loadAllProjects();
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  const handleUpdateProject = async (id: string) => {
    if (!editingProject) return;
    await updateProject(id, editingProject);
    loadAllProjects();
    loadProjects(); // Refresh the list view
    setEditingProject(null);
  };

  // Utils
  const filteredProjects = projects.filter(
    (p) => (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showcaseProjects = allProjects.filter((p) => p.showOnWebsite).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const availableForShowcase = allProjects.filter((p) => !p.showOnWebsite);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const getImageUrl = (img?: string) => {
    if (!img || img.includes('via.placeholder.com')) return 'https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage construction projects and portfolio.</p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {[
            { id: 'pending', label: 'In Progress', icon: Clock },
            { id: 'completed', label: 'Completed', icon: Check },
            { id: 'showcase', label: 'Website Showcase', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'showcase' ? (
        <div className="space-y-8">
          {/* Live Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Live on Website ({showcaseProjects.length})</h3>
            </div>

            {showcaseProjects.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500 border-dashed">
                <Globe className="w-12 h-12 mb-3 text-gray-300" />
                <p>No projects visible on website.</p>
                <p className="text-sm">Select projects from below to showcase them.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {showcaseProjects.map((project) => (
                  <Card key={project._id} noPadding className="overflow-hidden group">
                    <div className="relative aspect-video bg-gray-100">
                      <img src={getImageUrl(project.images?.[0] || project.image)} alt={project.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer text-white backdrop-blur-sm transition-colors">
                          <Upload className="w-5 h-5" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(project._id, file);
                          }} />
                        </label>
                        <button onClick={() => handleToggleShowcase(project._id)} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg text-white backdrop-blur-sm transition-colors">
                          <EyeOff className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="success" size="sm" className="shadow-sm">Live</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 truncate">{project.title || project.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{project.projectType} • {project.status}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Available Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Available for Showcase</h3>
              <span className="text-xs text-gray-500">Showing {availableForShowcase.length} projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableForShowcase.map((project) => (
                <div key={project._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all">
                  <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden shrink-0">
                    <img src={getImageUrl(project.images?.[0] || project.image)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{project.title || project.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{project.projectType}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleToggleShowcase(project._id)} title="Add to Showcase">
                    <Plus className="w-4 h-4 text-gray-400 hover:text-gray-900" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* List View for Pending/Completed */
        <Card className="flex flex-col" noPadding>
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Timeline</th>
                  <th className="px-6 py-3">Budget</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
                ) : filteredProjects.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No projects found matching your search.</td></tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                            <img src={getImageUrl(project.images?.[0] || project.image)} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{project.title || project.name}</div>
                            {project.location && (
                              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <MapPin className="w-3 h-3 mr-1" />
                                {project.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral" className="capitalize">{project.projectType}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-900">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</span>
                          <span className="text-xs text-gray-500">Start Date</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {project.budget ? formatCurrency(project.budget) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => setEditingProject(project)}>Edit</Button>
                          {activeTab === 'pending' && <Button variant="ghost" size="sm" onClick={() => handleCompleteProject(project._id)}>Complete</Button>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal (Simplified) */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl" noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Edit Project</h3>
              <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Project Name"
                value={editingProject.title || editingProject.name || ''}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value, name: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL</label>
                <Input
                  value={editingProject.videoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                  placeholder="e.g. YouTube/Vimeo link"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Type"
                  value={editingProject.projectType || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value as Project['projectType'] })}
                />
                <Input
                  label="Budget"
                  type="number"
                  value={editingProject.budget || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, budget: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingProject(null)}>Cancel</Button>
              <Button onClick={() => handleUpdateProject(editingProject._id)}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Projects;
