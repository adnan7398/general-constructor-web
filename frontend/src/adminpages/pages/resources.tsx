import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Edit3, Trash2, Package, CheckCircle2,
  Activity, AlertCircle, X, Wrench, Users, Truck, Settings
} from 'lucide-react';
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getAllProjects,
  Resource,
  Project
} from '../../api/resources';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<Resource, '_id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    siteName: '',
    type: 'Material',
    quantity: 0,
    status: 'Available',
    location: '',
    cost: 0,
    startDate: undefined,
    endDate: undefined,
    description: '',
  });

  useEffect(() => {
    loadResources();
    loadProjects();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingResource) {
        await updateResource(editingResource._id, formData);
      } else {
        await createResource(formData);
      }
      setShowAddForm(false);
      setEditingResource(null);
      resetForm();
      loadResources();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (confirm(`Are you sure you want to delete ${resource.name}?`)) {
      try {
        await deleteResource(resource._id);
        loadResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      siteName: '',
      type: 'Material',
      quantity: 0,
      status: 'Available',
      location: '',
      cost: 0,
      startDate: undefined,
      endDate: undefined,
      description: '',
    });
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Material': return <Package className="h-4 w-4" />;
      case 'Equipment': return <Wrench className="h-4 w-4" />;
      case 'Labor': return <Users className="h-4 w-4" />;
      case 'Vehicle': return <Truck className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Track materials, equipment, and labor availability.</p>
        </div>
        <Button
          onClick={() => { setShowAddForm(true); setEditingResource(null); resetForm(); }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Resources', value: resources.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Available', value: resources.filter(r => r.status === 'Available').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'In Use', value: resources.filter(r => r.status === 'In Use').length, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Maintenance/Damaged', value: resources.filter(r => ['Damaged', 'Maintenance'].includes(r.status)).length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <Card key={i} noPadding className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card noPadding className="flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            />
          </div>
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Project/Site</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : filteredResources.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No resources found.</td></tr>
              ) : (
                filteredResources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{resource.name}</div>
                          <div className="text-xs text-gray-500">{formatCurrency(resource.cost)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.siteName || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{resource.quantity}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={resource.status === 'Available' ? 'success' : resource.status === 'In Use' ? 'neutral' : 'error'}
                        size="sm"
                      >
                        {resource.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingResource(resource); setFormData({
                            name: resource.name,
                            siteName: resource.siteName,
                            type: resource.type,
                            quantity: resource.quantity,
                            status: resource.status,
                            location: resource.location || '',
                            cost: resource.cost,
                            startDate: resource.startDate,
                            endDate: resource.endDate,
                            description: resource.description || '',
                          }); setShowAddForm(true);
                        }}>
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(resource)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl" noPadding>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">{editingResource ? 'Edit Resource' : 'Add Resource'}</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  {['Material', 'Equipment', 'Labor', 'Vehicle', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm bg-white"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                >
                  <option value="">Select Project...</option>
                  {projects.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <Input label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} />
              <Input label="Cost" type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  {['Available', 'In Use', 'Pending', 'Completed', 'Damaged'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingResource ? 'Save Changes' : 'Create Resource'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Resources;