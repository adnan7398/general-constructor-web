import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Mail, Phone, Calendar, User, Building, Eye } from 'lucide-react';
import { 
  getTeamMembers, 
  addTeamMember, 
  deleteTeamMember, 
  getAllProjects,
  TeamMember
} from '../../api/teammember';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  projectType: 'commercial' | 'industrial' | 'residential' | 'infrastructure';
  startDate: Date;
  endDate: Date;
  budget: number;
  location: string;
  clientName: string;
}

interface TeamMemberWithProjects {
  _id: string;
  name: string;
  role: 'Engineer' | 'Architect' | 'Contractor' | 'Manager' | 'Supervisor' | 'Worker';
  contact: {
    phone: string;
    email: string;
  };
  profileImage: string;
  assignedProject: Project[];
  joinedDate: Date;
  isActive: boolean;
}

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMemberWithProjects | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [form, setForm] = useState<Omit<TeamMember, '_id'>>({
    name: '',
    role: 'Engineer',
    contact: {
      phone: '',
      email: '',
    },
    profileImage: '',
    assignedProject: [],
    joinedDate: new Date(),
    isActive: true,
  });

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchProjects();
  }, []);

  const handleAdd = async () => {
    try {
      const preparedForm = {
        ...form,
        assignedProject: Array.isArray(form.assignedProject)
          ? form.assignedProject
          : [form.assignedProject]
      };

      await addTeamMember(preparedForm);

      setForm({
        name: '',
        role: 'Engineer',
        contact: { phone: '', email: '' },
        profileImage: '',
        assignedProject: [],
        joinedDate: new Date(),
        isActive: true
      });

      setIsOpen(false);
      fetchMembers();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeamMember(id);
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      Engineer: 'bg-blue-100 text-blue-800 border-blue-200',
      Architect: 'bg-purple-100 text-purple-800 border-purple-200',
      Contractor: 'bg-green-100 text-green-800 border-green-200',
      Manager: 'bg-red-100 text-red-800 border-red-200',
      Supervisor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Worker: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role as keyof typeof colors] || colors.Worker;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
          <p className="text-gray-600">Manage your construction team efficiently</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center font-medium"
        >
          <Plus className="mr-2 w-5 h-5" /> Add Team Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={member.profileImage || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {member.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-6 pb-6 space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{member.contact.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-sm">{member.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Joined {new Date(member.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Building className="w-4 h-4 text-orange-500" />
                <span className="text-sm">{member.assignedProject.length} Project(s)</span>
              </div>
            </div>

            {/* Status Bar */}
            <div className={`px-6 py-3 ${member.isActive ? 'bg-green-50 border-t border-green-100' : 'bg-gray-50 border-t border-gray-100'}`}>
              <div className="flex items-center justify-center">
                <span className={`text-sm font-medium ${member.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                  {member.isActive ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first team member</p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center font-medium"
          >
            <Plus className="mr-2 w-5 h-5" /> Add Team Member
          </button>
        </div>
      )}

      {/* Enhanced Modal */}
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Add New Team Member</h2>
              <p className="text-blue-100 mt-1">Fill in the details below</p>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as TeamMember['role'] })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="Engineer">Engineer</option>
                    <option value="Architect">Architect</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Worker">Worker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    value={form.profileImage}
                    onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john.doe@company.com"
                    value={form.contact.email}
                    onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1-234-567-8900"
                    value={form.contact.phone}
                    onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Project Assignment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Project Assignment</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Projects</label>
                  <select
                    multiple
                    value={form.assignedProject}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setForm({ ...form, assignedProject: selectedOptions });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    {projects.map(project => (
                      <option key={project._id} value={project._id} className="py-2">
                        {project.name} - {project.status}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple projects</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    value={form.joinedDate.toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, joinedDate: new Date(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active team member
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;