import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  ExternalLink,
  BarChart3,
  Activity,
  Hammer,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Users,
  Truck,
  HardHat,
  Wrench,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Shield
} from 'lucide-react';

interface ConstructionResource {
  _id?: string;
  siteName: string;
  name: string;
  type: 'equipment' | 'material' | 'labor' | 'contractor' | 'permit' | 'vehicle';
  status: 'active' | 'inactive' | 'maintenance' | 'pending';
  location?: string;
  contact?: string;
  cost?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

interface GroupedResources {
  [siteName: string]: ConstructionResource[];
}

// Mock API functions for construction management
const API_BASE = 'http://localhost:3000/resources';
const api = {
    getAllResources: async (): Promise<GroupedResources> => {
      try {
        const res = await fetch('http://localhost:3000/resources');
        if (!res.ok) throw new Error('Failed to fetch resources');
  
        const data = await res.json();
        
        // Optional: group by site if needed
        const grouped: GroupedResources = data.reduce((acc: any, resource: any) => {
          const site = resource.site || 'Unassigned';
          if (!acc[site]) acc[site] = [];
          acc[site].push(resource);
          return acc;
        }, {});
  
        return grouped;
      } catch (err) {
        console.error('API Error:', err);
        return {};
      }
    },  
  getSiteResources: async (siteName: string): Promise<ConstructionResource[]> => {
    const grouped = await api.getAllResources();
    return grouped[siteName] || [];
  },
  
  createResource: async (resource: Omit<ConstructionResource, '_id'>): Promise<ConstructionResource> => {
    return { ...resource, _id: Date.now().toString() };
  },
  
  deleteResource: async (id: string): Promise<void> => {
    console.log(`Deleted construction resource ${id}`);
  }
};

const  Resources = () =>{
  const [resources, setResources] = useState<GroupedResources>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<ConstructionResource | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'resources'>('dashboard');

  // Form state
  const [formData, setFormData] = useState<Omit<ConstructionResource, '_id'>>({
    siteName: '',
    name: '',
    type: 'equipment',
    status: 'pending',
    location: '',
    contact: '',
    cost: 0,
    description: '',
    startDate: '',
    endDate: ''
  });

  // Load resources
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.getAllResources();
      setResources(data);
    } catch (error) {
      console.error('Failed to load construction resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Computed statistics
  const stats = useMemo(() => {
    const allResources: ConstructionResource[] = Object.values(resources).flat();
    const totalCost = allResources.reduce((sum, r) => sum + (r.cost || 0), 0);
    
    return {
      total: allResources.length,
      active: allResources.filter(r => r.status === 'active').length,
      inactive: allResources.filter(r => r.status === 'inactive').length,
      maintenance: allResources.filter(r => r.status === 'maintenance').length,
      pending: allResources.filter(r => r.status === 'pending').length,
      sites: Object.keys(resources).length,
      totalCost: totalCost,
      equipment: allResources.filter(r => r.type === 'equipment').length,
      materials: allResources.filter(r => r.type === 'material').length,
      labor: allResources.filter(r => r.type === 'labor').length
    };
  }, [resources]);

  // Filter resources
  const filteredResources = useMemo(() => {
    let filtered: ConstructionResource[] = [];
    
    if (selectedSite === 'all') {
      filtered = Object.values(resources).flat();
    } else {
      filtered = resources[selectedSite] || [];
    }

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(resource => resource.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }

    return filtered;
  }, [resources, searchTerm, selectedSite, statusFilter, typeFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResource) {
        console.log('Update construction resource:', formData);
      } else {
        const newResource = await api.createResource(formData);
        const updatedResources = { ...resources };
        if (!updatedResources[formData.siteName]) {
          updatedResources[formData.siteName] = [];
        }
        updatedResources[formData.siteName].push(newResource);
        setResources(updatedResources);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save construction resource:', error);
    }
  };

  const handleDelete = async (resource: ConstructionResource) => {
    if (!resource._id || !confirm('Are you sure you want to delete this construction resource?')) return;
    
    try {
      await api.deleteResource(resource._id);
      const updatedResources = { ...resources };
      updatedResources[resource.siteName] = updatedResources[resource.siteName].filter(
        r => r._id !== resource._id
      );
      setResources(updatedResources);
    } catch (error) {
      console.error('Failed to delete construction resource:', error);
    }
  };

  const handleEdit = (resource: ConstructionResource) => {
    setEditingResource(resource);
    setFormData({
      siteName: resource.siteName,
      name: resource.name,
      type: resource.type,
      status: resource.status,
      location: resource.location || '',
      contact: resource.contact || '',
      cost: resource.cost || 0,
      description: resource.description || '',
      startDate: resource.startDate || '',
      endDate: resource.endDate || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      siteName: '',
      name: '',
      type: 'equipment',
      status: 'pending',
      location: '',
      contact: '',
      cost: 0,
      description: '',
      startDate: '',
      endDate: ''
    });
    setEditingResource(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Hammer className="w-5 h-5" />;
      case 'material': return <Activity className="w-5 h-5" />;
      case 'labor': return <Users className="w-5 h-5" />;
      case 'contractor': return <HardHat className="w-5 h-5" />;
      case 'permit': return <Shield className="w-5 h-5" />;
      case 'vehicle': return <Truck className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  const Dashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-600 via-white-700 to-gray-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Divine Developer</h1>
            <p className="text-orange-100 text-lg">Professional Construction Site Management</p>
            <p className="text-orange-200 text-sm mt-2">Building Excellence, Managing Success</p>
          </div>
          <div className="hidden md:block">
            <Building2 className="w-24 h-24 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Resources</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-100 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">In Maintenance</p>
              <p className="text-3xl font-bold">{stats.maintenance}</p>
            </div>
            <Wrench className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Cost</p>
              <p className="text-2xl font-bold">${stats.totalCost.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Resource Type Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Hammer className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Equipment</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.equipment}</p>
          <p className="text-gray-600 text-sm">Heavy machinery & tools</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Materials</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.materials}</p>
          <p className="text-gray-600 text-sm">Construction materials</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Labor</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.labor}</p>
          <p className="text-gray-600 text-sm">Workforce & contractors</p>
        </div>
      </div>

      {/* Construction Sites Overview */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-xl">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Construction Sites</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(resources).map(([siteName, siteResources]) => (
            <div key={siteName} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{siteName}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Resources</span>
                  <span className="font-semibold text-gray-900">{siteResources.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-semibold text-green-600">{siteResources.filter(r => r.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-yellow-600">{siteResources.filter(r => r.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <span className="font-semibold text-orange-600">
                    ${siteResources.reduce((sum, r) => sum + (r.cost || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedSite(siteName);
                  setCurrentView('resources');
                }}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Manage Site
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ResourcesView = () => (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Construction Resource Management</h1>
            <p className="text-gray-600">Manage equipment, materials, labor, and contractors across all construction sites</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>
          
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          >
            <option value="all">All Sites</option>
            {Object.keys(resources).map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          >
            <option value="all">All Types</option>
            <option value="equipment">Equipment</option>
            <option value="material">Materials</option>
            <option value="labor">Labor</option>
            <option value="contractor">Contractors</option>
            <option value="permit">Permits</option>
            <option value="vehicle">Vehicles</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  {getTypeIcon(resource.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                  <p className="text-sm text-gray-500">{resource.siteName}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(resource)}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(resource)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="font-medium text-gray-900 capitalize">{resource.type}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(resource.status)}`}>
                  {getStatusIcon(resource.status)}
                  <span className="capitalize">{resource.status}</span>
                </div>
              </div>
              
              {resource.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <MapPin className="w-3 h-3" />
                    <span>{resource.location}</span>
                  </div>
                </div>
              )}
              
              {resource.contact && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contact</span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    {resource.contact.includes('@') ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                    <span className="truncate max-w-32">{resource.contact}</span>
                  </div>
                </div>
              )}
              
              {resource.cost && resource.cost > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost</span>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <DollarSign className="w-3 h-3" />
                    <span>{resource.cost.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              {resource.startDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Start Date</span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(resource.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {resource.description && (
                <div>
                  <span className="text-sm text-gray-600">Description</span>
                  <p className="text-sm text-gray-900 mt-1">{resource.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No construction resources found</h3>
          <p className="text-gray-400">Try adjusting your filters or add a new resource</p>
        </div>
      )}
    </div>
  );

  const AddResourceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingResource ? 'Edit Construction Resource' : 'Add New Construction Resource'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter resource name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Construction Site</label>
                <input
                  type="text"
                  required
                  value={formData.siteName}
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter construction site name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as ConstructionResource['type']})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                  <option value="equipment">Equipment</option>
                  <option value="material">Material</option>
                  <option value="labor">Labor</option>
                  <option value="contractor">Contractor</option>
                  <option value="permit">Permit</option>
                  <option value="vehicle">Vehicle</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as ConstructionResource['status']})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Site location or storage area"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Phone number or email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Brief description of the construction resource"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-2xl transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading construction resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Divine Developer</h1>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    currentView === 'dashboard' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('resources')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                    currentView === 'resources' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? <Dashboard /> : <ResourcesView />}
      </main>

      {/* Add/Edit Form Modal */}
      {showAddForm && <AddResourceForm />}
    </div>
  );
}

export default Resources;